package main

import (
	"fmt"
	"log"
	"os"
	"time"
	"sync"
	"errors"
	"path/filepath"

	vegeta "github.com/tsenart/vegeta/lib"
)

var (
	isExecuting = false
	execFlagLock sync.Mutex

	errNowExecuting = errors.New("attacker is executing now")
)

// AttackExecuter aggregates the instances to attack
type AttackExecuter struct {
	attacker *vegeta.Attacker
	targeter vegeta.Targeter
	rate uint64
	duration time.Duration
}

// RegisterAttack register vegeta attack job
func (executer *AttackExecuter) RegisterAttack(resultsBasePath string) (error) {
	execFlagLock.Lock()
	defer execFlagLock.Unlock()

	if isExecuting {
		return errNowExecuting
	}

	// do attack
	isExecuting = true
	go func() {
		filePath := resultFilePath(resultsBasePath)
		if err := attack(executer, filePath); err != nil {
			log.Println(err)
		}
		execFlagLock.Lock()
		isExecuting = false
		execFlagLock.Unlock()
	}()

	return nil
}

func resultFilePath(basePath string) string {
	filename := fmt.Sprintf("%d.bin", time.Now().UnixNano())
	return filepath.Join(basePath, filename)
}

func attack(executer *AttackExecuter, filePath string) error {
	out, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("error opening %s: %s", filePath, err)
	}
	defer out.Close()

	res := executer.attacker.Attack(executer.targeter, executer.rate, executer.duration)
	enc := vegeta.NewEncoder(out)

	for {
		select {
		case r, ok := <-res:
			if !ok {
				return nil
			}
			if err = enc.Encode(r); err != nil {
				return err
			}
			log.Println(r)
		}
	}
}
