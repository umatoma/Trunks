package server

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	vegeta "github.com/tsenart/vegeta/lib"
)

var (
	currentWorker   *AttackWorker
	lock            sync.Mutex
	errNowExecuting = errors.New("attacker is executing now")
)

// AttackWorker aggregates the instances to attack
type AttackWorker struct {
	attacker *vegeta.Attacker
	targeter vegeta.Targeter
	rate     uint64
	duration time.Duration
	ctx      context.Context
	cancel   context.CancelFunc
	broadcaster Broadcaster
}

// StopAttack stop current attack
func StopAttack() bool {
	lock.Lock()
	defer lock.Unlock()

	if currentWorker == nil {
		return false
	}
	// cancel jobs
	currentWorker.cancel()

	return true
}

// NewAttackWorker returns a new AttackWorker with default options
func NewAttackWorker(atk *vegeta.Attacker, tr vegeta.Targeter, rate uint64, duration time.Duration, broadcaster Broadcaster) *AttackWorker {
	ctx, cancel := context.WithCancel(context.Background())
	return &AttackWorker{
		attacker: atk,
		targeter: tr,
		rate:     rate,
		duration: duration,
		ctx:      ctx,
		cancel:   cancel,
		broadcaster: broadcaster,
	}
}

// Run register vegeta attack job
func (worker *AttackWorker) Run(resultsBasePath string) error {
	lock.Lock()
	defer lock.Unlock()

	if currentWorker != nil {
		return errNowExecuting
	}

	// do attack
	currentWorker = worker
	go func() {
		defer worker.unbindWorker()
		// do attack!!
		log.Println("attack start")
		worker.broadcastAttackStart()
		resultFilePath, err := worker.attack(resultsBasePath)
		// failed attack
		if err != nil {
			log.Println("attack failed", err)
			worker.broadcastAttackFail(err)
		}
		if resultFilePath == "" {
			// canceled attack
			log.Println("attack canceled")
			worker.broadcastAttackCancel()
		} else {
			// success attack
			log.Println("attack succeeded")
			paths := strings.Split(resultFilePath, "/")
			worker.broadcastAttackFinish(paths[len(paths) - 1])
		}
	}()

	return nil
}

// unbindWorker remove current worker binding
func (worker *AttackWorker) unbindWorker() {
	lock.Lock()
	defer lock.Unlock()
	if currentWorker == worker {
		currentWorker = nil
	}
}

func (worker *AttackWorker) attack(baseFilePath string) (string, error) {
	tmpFilePath := tmpFile(baseFilePath)

	out, err := os.Create(tmpFilePath)
	if err != nil {
		return "", fmt.Errorf("error opening %s: %s", tmpFilePath, err)
	}
	defer out.Close()

	atk := worker.attacker
	res := atk.Attack(worker.targeter, worker.rate, worker.duration)
	enc := vegeta.NewEncoder(out)

	metrics := &vegeta.Metrics{}
	defer metrics.Close()
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

attack:
	for {
		select {
		case <-worker.ctx.Done():
			atk.Stop()
			return "", nil
		case <-ticker.C:
			worker.broadcastAttackMetrics(metrics)
		case r, ok := <-res:
			if !ok {
				worker.broadcastAttackMetrics(metrics)
				break attack
			}
			if err = enc.Encode(r); err != nil {
				return "", err
			}
			// add result to report
			metrics.Add(r)
			metrics.Close()
			log.Println(r)
		}
	}

	// from 00000.tmp to 00000.bin
	out.Close()
	resultFilePath := resultFile(baseFilePath)
	if err := os.Rename(tmpFilePath, resultFilePath); err != nil {
		return "", err
	}

	return resultFilePath, nil
}

func tmpFile(basePath string) string {
	filename := fmt.Sprintf("%d.tmp", time.Now().Unix())
	return filepath.Join(basePath, filename)
}

func resultFile(basePath string) string {
	filename := fmt.Sprintf("%d.bin", time.Now().Unix())
	return filepath.Join(basePath, filename)
}

func (worker *AttackWorker) broadcastAttackStart() {
	worker.broadcaster.Broadcast("attackStart", map[string]interface{}{
		"rate":     worker.rate,
		"duration": worker.duration,
	})
}

func (worker *AttackWorker) broadcastAttackFinish(filename string) {
	worker.broadcaster.Broadcast("attackFinish", map[string]string{
		"filename": filename,
	})
}

func (worker *AttackWorker) broadcastAttackCancel() {
	worker.broadcaster.Broadcast("attackCancel", nil)
}

func (worker *AttackWorker) broadcastAttackFail(err error) {
	worker.broadcaster.Broadcast("attackFail", map[string]string{
		"message": err.Error(),
	})
}

func (worker *AttackWorker) broadcastAttackMetrics(metrics *vegeta.Metrics) {
	worker.broadcaster.Broadcast("attackMetrics", metrics)
}
