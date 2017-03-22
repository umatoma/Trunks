package main

import (
	"flag"
	"log"

	"github.com/umatoma/trunks/server"
)

func main() {
	// initialize handler
	h := server.NewHandler(server.NewWebSocketHub())

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
	if err := server.StartEchoServer(h, ":3000"); err != nil {
		log.Fatalln(err)
	}
}
