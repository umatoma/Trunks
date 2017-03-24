package server

import (
	"log"
	"sync"
)

type Runner interface {
	Run(worker *AttackWorker) error
	Stop() bool
}

// AttackWorkerRunner manage worker status
type AttackWorkerRunner struct {
	ResultsBasePath string
	worker          *AttackWorker
	lock            sync.Mutex
}

// NewAttackWorkerRunner returns a new AttackWorkerRunner with default options
func NewAttackWorkerRunner(resultsBasePath string) *AttackWorkerRunner {
	return &AttackWorkerRunner{
		ResultsBasePath: resultsBasePath,
	}
}

// Run register vegeta attack job
func (r *AttackWorkerRunner) Run(worker *AttackWorker) error {
	r.lock.Lock()
	defer r.lock.Unlock()

	if r.worker != nil {
		return errNowExecuting
	}

	// do attack
	r.worker = worker

	go func() {
		if err := r.worker.Run(r.ResultsBasePath); err != nil {
			log.Println("failed worker.Run: ", err)
		}
		r.lock.Lock()
		defer r.lock.Unlock()
		if r.worker != nil {
			r.worker = nil
		}
	}()

	return nil
}

// Stop stop current attack
func (r *AttackWorkerRunner) Stop() bool {
	r.lock.Lock()
	defer r.lock.Unlock()

	if r.worker == nil {
		return false
	}
	// cancel worker
	r.worker.cancel()

	return true
}
