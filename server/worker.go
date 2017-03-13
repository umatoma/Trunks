package main

import (
	"context"
	"errors"
	"fmt"
	"io"
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
		if err := worker.attack(filePath, os.Stdout); err != nil {
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

func (worker *AttackWorker) attack(filePath string, reportWriter io.Writer) error {
	out, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("error opening %s: %s", filePath, err)
	}
	defer out.Close()

	atk := worker.attacker
	res := atk.Attack(worker.targeter, worker.rate, worker.duration)
	enc := vegeta.NewEncoder(out)

	var m vegeta.Metrics
	report := &m
	reporter := vegeta.NewJSONReporter(&m)
	ticker := time.NewTicker(2 * time.Second)

attack:
	for {
		select {
		case <-worker.ctx.Done():
			atk.Stop()
			log.Println("stopped attack")
			return nil
		case <-ticker.C:
			reporter.Report(reportWriter)
		case r, ok := <-res:
			if !ok {
				log.Println("finish attack")
				break attack
			}
			if err = enc.Encode(r); err != nil {
				return err
			}
			// add result to report
			report.Add(r)
			log.Println(r)
		}
	}
	// stop time tiker
	ticker.Stop()

	return nil
}

func resultFilePath(basePath string) string {
	filename := fmt.Sprintf("%d.bin", time.Now().UnixNano())
	return filepath.Join(basePath, filename)
}
