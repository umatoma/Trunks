package main

import (
	"log"
	"net/http"

	"github.com/labstack/echo"
)

func main() {
	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello Trunks!!")
	})

	if err := e.Start(":3000"); err != nil {
		log.Fatalln(err)
	}
}
