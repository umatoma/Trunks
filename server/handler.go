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

	executer, err := opts.GetAttackExecuter()
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if err := executer.Attack("./tmp/result.bin"); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

  return c.JSON(http.StatusOK, opts)
}
