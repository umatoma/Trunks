package main

import (
	"flag"
	"log"
	"fmt"
	"os"

	"github.com/umatoma/trunks/server"
)

type options struct {
	ResultsDir string
}

// validate check if options is valid
func (opt *options) validate() error {
	if opt.ResultsDir == "" {
		return fmt.Errorf("results dir should not be empty")
	}

	if err := os.MkdirAll(opt.ResultsDir, 0777); err != nil {
		return err
	}

	return nil
}

func main() {
	opts := &options{}

	// command options
	fs := flag.NewFlagSet("trunks", flag.ExitOnError)
	fs.StringVar(&opts.ResultsDir, "r", "results", "Results file dir")

	// check if options is valid
	if err := opts.validate(); err != nil {
		log.Fatalln(err)
	}

	// start websocket server
	webSocketHub := server.NewWebSocketHub()
	go webSocketHub.Run()

	// initialize handler
	h := server.NewHandler(
		webSocketHub,
		server.NewAttackWorkerRunner(opts.ResultsDir),
		opts.ResultsDir,
	)

	// start server
	if err := server.StartEchoServer(h, ":3000"); err != nil {
		log.Fatalln(err)
	}
}
