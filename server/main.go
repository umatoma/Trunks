package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/elazarl/go-bindata-assetfs"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

var webSocketHub = NewWebSocketHub()

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

	// start websocket server
	go webSocketHub.Run()

	// create echo server instance
	e := echo.New()

	// middlewares
	e.Use(middleware.Logger())

	// routes
	e.GET("/", h.IndexHTML)
	e.GET("/results/:filename", h.IndexHTML)
	e.POST("/api/attack", h.PostAttack)
	e.DELETE("/api/attack", h.StopAttack)
	e.GET("/api/results/files", h.ShowResultFiles)
	e.GET("/api/reports/:filename", h.ShowReport)

	// for websocket
	e.GET("/ws", func(c echo.Context) error {
		serveWebSocket(webSocketHub, c.Response().Writer, c.Request())
		return nil
	})

	// serve static files
	fileServerHandler := http.FileServer(&assetfs.AssetFS{
		Asset:     Asset,
		AssetDir:  AssetDir,
		AssetInfo: AssetInfo,
		Prefix:    "assets",
	})
	e.GET("*", func(c echo.Context) error {
		fileServerHandler.ServeHTTP(c.Response().Writer, c.Request())
		return nil
	})

	// start server
	if err := e.Start(":3000"); err != nil {
		log.Fatalln(err)
	}
}
