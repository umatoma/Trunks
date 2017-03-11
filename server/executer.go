package main

import (
	"fmt"
	"log"
	"os"
	"io"
	"time"
	"sync"
	"errors"
	"path/filepath"

	vegeta "github.com/tsenart/vegeta/lib"
)

var (
	currentExeuter *AttackExecuter
	execFlagLock sync.Mutex

	errNowExecuting = errors.New("attacker is executing now")
)

// AttackExecuter aggregates the instances to attack
type AttackExecuter struct {
	attacker *vegeta.Attacker
	targeter vegeta.Targeter
	rate uint64
	duration time.Duration
	stop chan bool
	stopOnce sync.Once
}

// NewAttackExecuter returns a new AttackExecuter with default options
func NewAttackExecuter(atk *vegeta.Attacker, tr vegeta.Targeter, rate uint64, duration time.Duration) *AttackExecuter {
	return &AttackExecuter{
		attacker: atk,
		targeter: tr,
		rate: rate,
		duration: duration,
		stop: make(chan bool, 1),
	}
}

// RegisterAttack register vegeta attack job
func (executer *AttackExecuter) RegisterAttack(resultsBasePath string) (error) {
	execFlagLock.Lock()
	defer execFlagLock.Unlock()

	if currentExeuter != nil {
		return errNowExecuting
	}

	// do attack
	currentExeuter = executer
	go func() {
		filePath := resultFilePath(resultsBasePath)
		if err := executer.attack(filePath, os.Stdout); err != nil {
			log.Println(err)
		}
		executer.UnbindExecuter()
	}()

	return nil
}

// UnbindExecuter remove current executer binding
func (executer *AttackExecuter) UnbindExecuter() {
	execFlagLock.Lock()
	defer execFlagLock.Unlock()
	if currentExeuter == executer {
		currentExeuter = nil
	}
}

// StopAttack stop current attack
func StopAttack() bool {
	execFlagLock.Lock()
	defer execFlagLock.Unlock()

	if currentExeuter == nil {
		return false
	}

	currentExeuter.stopOnce.Do(func() {
		currentExeuter.stop <- true
	})

	return true
}

func resultFilePath(basePath string) string {
	filename := fmt.Sprintf("%d.bin", time.Now().UnixNano())
	return filepath.Join(basePath, filename)
}

func (executer *AttackExecuter) attack(filePath string, reportWriter io.Writer) error {
	out, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("error opening %s: %s", filePath, err)
	}
	defer out.Close()

	atk := executer.attacker
	res := atk.Attack(executer.targeter, executer.rate, executer.duration)
	enc := vegeta.NewEncoder(out)

	var m vegeta.Metrics
	report := &m
	reporter := vegeta.NewJSONReporter(&m)
	ticker := time.NewTicker(2 * time.Second)

	attack:
	for {
		select {
		case <-executer.stop:
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
