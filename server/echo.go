package server

import (
	"net/http"
	"time"

	log "github.com/Sirupsen/logrus"
	"github.com/elazarl/go-bindata-assetfs"
	"github.com/labstack/echo"
)

// NewEchoServer start echo http server
func NewEchoServer(h *Handler) *echo.Echo {
	// create echo server instance
	e := echo.New()

	// middlewares
	e.Use(newLoggerMiddleware())

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

	return e
}

func newLoggerMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) (err error) {
			start := time.Now()
			if err := next(c); err != nil {
				c.Error(err)
			}

			latency := time.Since(start)
			log.WithFields(log.Fields{
				"method":      c.Request().Method,
				"request":     c.Request().RequestURI,
				"status":      c.Response().Status,
				"text_status": http.StatusText(c.Response().Status),
				"took":        latency,
				"latency":     latency.Nanoseconds(),
			}).Info("completed handling request")

			return nil
		}
	}
}
