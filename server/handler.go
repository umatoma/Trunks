package main

import (
  "net/http"

  "github.com/labstack/echo"
)

// Handler is the HTTP handler
type Handler struct {}

// Index handle GET / request
func (h *Handler) Index(c echo.Context) error {
  return c.String(http.StatusOK, "Hello Trunks!!")
}

// PostAttack handle POST /attack request
func (h *Handler) PostAttack(c echo.Context) error {
	opts := NewAttackOptions()

	if err := c.Bind(opts); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if err := opts.Attack(); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

  return c.JSON(http.StatusOK, opts)
}
