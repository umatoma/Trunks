package main

import (
	"bytes"
	"os"
	"io"
	"path/filepath"
  "net/http"

  "github.com/labstack/echo"
	vegeta "github.com/tsenart/vegeta/lib"
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

// PostAttack handle POST /api/attack request
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

// StopAttack handle DELETE /api/attack request
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

// ShowReport handle GET /api/reports/:filename
func (h *Handler) ShowReport(c echo.Context) error {
	filename := c.Param("filename")
	file, err := os.Open(filepath.Join("tmp", filename))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	defer file.Close()

	decoder := vegeta.NewDecoder(file)

	var reporter vegeta.Reporter
	var report vegeta.Report
	var rs vegeta.Results
	reporter, report = vegeta.NewPlotReporter("Vegeta Plot", &rs), &rs

	for {
		var r vegeta.Result
		if err := decoder.Decode(&r); err != nil {
			if err == io.EOF {
				break
			}
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}
		report.Add(&r)
	}

	if c, ok := report.(vegeta.Closer); ok {
		c.Close()
	}

	var buf bytes.Buffer
	if err := reporter.Report(&buf); err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	return c.HTMLBlob(http.StatusOK, buf.Bytes())
}
