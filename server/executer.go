package main

import (
	"fmt"
	"log"
	"os"
	"time"

	vegeta "github.com/tsenart/vegeta/lib"
)

// AttackExecuter aggregates the instances to attack
type AttackExecuter struct {
	attacker *vegeta.Attacker
	targeter vegeta.Targeter
	rate uint64
	duration time.Duration
}

// Attack execute vegeta attack
func (executer *AttackExecuter) Attack(filename string) (error) {
	out, err := os.Create(filename)
	if err != nil {
		return fmt.Errorf("error opening %s: %s", filename, err)
	}
	defer out.Close()

	enc := vegeta.NewEncoder(out)
	for r := range executer.attacker.Attack(executer.targeter, executer.rate, executer.duration) {
		log.Println(r)
		if err = enc.Encode(r); err != nil {
			return err
		}
	}
	return nil
}
