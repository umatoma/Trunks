package server

import (
	"net/http"

	"github.com/elazarl/go-bindata-assetfs"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

// StartEchoServer start echo http server
func StartEchoServer(h *Handler, port string) error {
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
		serveWebSocket(h.webSocketHub, c.Response().Writer, c.Request())
		return nil
	})

	// assets
	e.GET("*", func(c echo.Context) error {
		http.FileServer(&assetfs.AssetFS{
			Asset:     Asset,
			AssetDir:  AssetDir,
			AssetInfo: AssetInfo,
			Prefix:    "assets",
		}).ServeHTTP(c.Response().Writer, c.Request())
		return nil
	})

	return e.Start(port)
}
