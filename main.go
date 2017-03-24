package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"

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

	// create context
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// start websocket server
	webSocketHub := server.NewWebSocketHub()
	go func() {
		log.Println("start WebSocketHub...")
		webSocketHub.Run(ctx)
		log.Println("close WebSocketHub...")
	}()

	// initialize handler
	h := server.NewHandler(
		webSocketHub,
		server.NewAttackWorkerRunner(opts.ResultsDir),
		opts.ResultsDir,
	)

	// create web server
	e := server.NewEchoServer(h)

	// start server
	go func() {
		log.Println("start web server...")
		if err := e.Start(":3000"); err != nil {
			log.Println("close web server...")
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server with
	// a timeout of 10 seconds.
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	<-quit

	if err := e.Shutdown(ctx); err != nil {
		e.Logger.Fatal(err)
	}
}
