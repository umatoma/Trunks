package main

import (
	"fmt"
	"log"
	"os"
	"time"
	"sync"
	"errors"

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
func (executer *AttackExecuter) RegisterAttack(filename string) (error) {
	execFlagLock.Lock()
	defer execFlagLock.Unlock()

	if isExecuting {
		return errNowExecuting
	}

	// do attack
	isExecuting = true
	go func() {
		if err := executer.attack(filename); err != nil {
			log.Println(err)
		}
		execFlagLock.Lock()
		isExecuting = false
		execFlagLock.Unlock()
	}()

	return nil
}

func (executer *AttackExecuter) attack(filename string) error {
	out, err := os.Create(filename)
	if err != nil {
		return fmt.Errorf("error opening %s: %s", filename, err)
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
