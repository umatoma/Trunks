package main

import (
	"log"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	// initialize handler
	h := &Handler{}

	// create echo server instance
	e := echo.New()

	// middlewares
	e.Use(middleware.Logger())

	// routes
	e.GET("/", h.Index)
	e.POST("/attack", h.PostAttack)
	e.DELETE("/attack", h.StopAttack);

	// start server
	if err := e.Start(":3000"); err != nil {
		log.Fatalln(err)
	}
}
