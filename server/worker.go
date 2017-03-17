package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
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
func NewAttackWorker(atk *vegeta.Attacker, tr vegeta.Targeter, rate uint64, duration time.Duration) *AttackWorker {
	ctx, cancel := context.WithCancel(context.Background())
	return &AttackWorker{
		attacker: atk,
		targeter: tr,
		rate:     rate,
		duration: duration,
		ctx:      ctx,
		cancel:   cancel,
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
		filePath := resultFilePath(resultsBasePath)
		if err := worker.attack(filePath, webSocketHub); err != nil {
			log.Println(err)
		}
		worker.UnbindWorker()
	}()

	return nil
}

// UnbindWorker remove current worker binding
func (worker *AttackWorker) UnbindWorker() {
	lock.Lock()
	defer lock.Unlock()
	if currentWorker == worker {
		currentWorker = nil
	}
}

func (worker *AttackWorker) attack(filePath string, broadcaster Broadcaster) error {
	out, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("error opening %s: %s", filePath, err)
	}
	defer out.Close()

	stat, err := out.Stat()
	if err != nil {
		return err
	}

	atk := worker.attacker
	res := atk.Attack(worker.targeter, worker.rate, worker.duration)
	enc := vegeta.NewEncoder(out)

	log.Println("start attack", stat.Name())
	broadcaster.Broadcast("attackStart", map[string]interface{}{
		"rate": worker.rate,
		"duration": worker.duration,
	})

	metrics := &vegeta.Metrics{}
	defer metrics.Close()
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

attack:
	for {
		select {
		case <-worker.ctx.Done():
			atk.Stop()
			log.Println("stopped attack", stat.Name())
			return nil
		case <-ticker.C:
			broadcaster.Broadcast("attackMetrics", metrics)
		case r, ok := <-res:
			if !ok {
				broadcaster.Broadcast("attackMetrics", metrics)
				break attack
			}
			if err = enc.Encode(r); err != nil {
				return err
			}
			// add result to report
			metrics.Add(r)
			metrics.Close()
			log.Println(r)
		}
	}

	log.Println("finish attack", stat.Name())
	broadcaster.Broadcast("attackFinish", map[string]interface{}{
		"filename": stat.Name(),
	})

	return nil
}

func resultFilePath(basePath string) string {
	filename := fmt.Sprintf("%d.bin", time.Now().Unix())
	return filepath.Join(basePath, filename)
}
