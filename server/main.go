package main

import (
	"flag"
	"log"
)

func main() {
	// initialize handler
	h := &Handler{WebSocketHub: NewWebSocketHub()}

	// command options
	fs := flag.NewFlagSet("trunks", flag.ExitOnError)
	fs.StringVar(&h.ResultsDir, "r", "results", "Results file dir")

	// check if options is valid
	if err := h.ValidateOptions(); err != nil {
		log.Fatalln(err)
	}

	// start websocket server
	go h.WebSocketHub.Run()

	// start server
	if err := StartEchoServer(h, ":3000"); err != nil {
		log.Fatalln(err)
	}
}
