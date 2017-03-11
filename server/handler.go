package main

import (
  "net/http"

  "github.com/labstack/echo"
)

// Handler is the HTTP handler
type Handler struct {}

// Index handle GET / request
func (h *Handler) Index(c echo.Context) error {
	bytes, err := Asset("assets/index.html")
	if err != nil {
		echo.NewHTTPError(http.StatusNotFound, err.Error())
	}

  return c.HTMLBlob(http.StatusOK, bytes)
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

	if err := executer.RegisterAttack("tmp"); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

  return c.JSON(http.StatusOK, opts)
}

// StopAttack handle DELETE /attack request
func (h *Handler) StopAttack(c echo.Context) error {
	if ok := StopAttack(); !ok {
		return c.JSON(http.StatusOK, map[string]string{
			"message": "failed to stop the attack",
		})
	}
	return c.JSON(http.StatusOK, map[string]string{
		"message": "stop the attack",
	})
}
