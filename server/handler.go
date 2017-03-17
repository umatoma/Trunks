package main

import (
	"bytes"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"io/ioutil"
	"strings"

	"github.com/labstack/echo"
)

// Handler is the HTTP handler
type Handler struct {
	ResultsDir string
}

// ValidateOptions check if options is valid
func (h *Handler) ValidateOptions() error {
	if h.ResultsDir == "" {
		return fmt.Errorf("results dir should not be empty")
	}

	if err := os.MkdirAll(h.ResultsDir, 0777); err != nil {
		return err
	}

	return nil
}

// Index handle GET / request
func (h *Handler) Index(c echo.Context) error {
	bytes, err := Asset("views/index.html")
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

	worker, err := opts.GetAttackWorker()
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if err := worker.Run(h.ResultsDir); err != nil {
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

func (h *Handler) ShowResultFiles(c echo.Context) error {
	files, err := ioutil.ReadDir(h.ResultsDir)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	paths := make([]string, 0)
	for _, file := range files {
		if file.IsDir() {
			continue
		}
		if strings.HasSuffix(file.Name(), ".bin") {
			paths = append(paths, file.Name())
		}
	}

	return c.JSON(http.StatusOK, paths)
}

// ShowReport handle GET /api/reports/:filename
func (h *Handler) ShowReport(c echo.Context) error {
	filename := c.Param("filename")
	file, err := os.Open(filepath.Join(h.ResultsDir, filename))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	defer file.Close()

	reporter, err := JSONREsultsReporterFactory(file)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	var buf bytes.Buffer
	if err := reporter.Report(&buf); err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	return c.JSONBlob(http.StatusOK, buf.Bytes())
}
