package main

import (
	"flag"
	"log"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	// initialize handler
	h := &Handler{}

	// command options
	fs := flag.NewFlagSet("trunks", flag.ExitOnError)
	fs.StringVar(&h.ResultsDir, "r", "results", "Results file dir")

	// check if options is valid
	if err := h.ValidateOptions(); err != nil {
		log.Fatalln(err)
	}

	// create echo server instance
	e := echo.New()

	// middlewares
	e.Use(middleware.Logger())

	// routes
	e.GET("/", h.Index)
	e.POST("/api/attack", h.PostAttack)
	e.DELETE("/api/attack", h.StopAttack)
	e.GET("/api/reports/:filename", h.ShowReport)

	// start server
	if err := e.Start(":3000"); err != nil {
		log.Fatalln(err)
	}
}
