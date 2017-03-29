package main

import (
	"context"
	"flag"
	"fmt"
	"os"

	"github.com/umatoma/trunks/server"
	log "github.com/Sirupsen/logrus"
)

type options struct {
	resultsDir string
	addr       string
}

// validate check if options is valid
func (opt *options) validate() error {
	if opt.resultsDir == "" {
		return fmt.Errorf("results dir should not be empty")
	}

	if opt.addr == "" {
		return fmt.Errorf("addr should not be empty")
	}

	if err := os.MkdirAll(opt.resultsDir, 0777); err != nil {
		return err
	}

	return nil
}

func (opt *options) String() string {
	return fmt.Sprintf("resultsDir=%s addr=%s", opt.resultsDir, opt.addr)
}

func main() {
	opts := &options{}

	// command options
	fs := flag.NewFlagSet("trunks", flag.ExitOnError)
	fs.StringVar(&opts.resultsDir, "results", "results", "Results file dir")
	fs.StringVar(&opts.addr, "addr", "0.0.0.0:3000", "Addr")
	fs.Parse(os.Args[1:])

	// logger settings
	log.SetOutput(os.Stdout)
	log.SetLevel(log.InfoLevel)

	log.WithFields(log.Fields{
		"results": opts.resultsDir,
		"addr": opts.addr,
	}).Info("options")

	// check if options is valid
	if err := opts.validate(); err != nil {
		log.Fatalln(err)
	}

	// create context
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// start websocket server
	webSocketHub := server.NewWebSocketHub()
	go func() {
		log.Println("start WebSocketHub")
		webSocketHub.Run(ctx)
		log.Println("close WebSocketHub")
	}()

	// initialize handler
	h := server.NewHandler(
		webSocketHub,
		server.NewAttackWorkerRunner(opts.resultsDir),
		opts.resultsDir,
	)

	// create web server
	e := server.NewEchoServer(h)

	// start server
	log.Fatal(e.Start(opts.addr))
}
