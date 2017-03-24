package server

import (
	"bytes"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/labstack/echo"
)

// Handler is the HTTP handler
type Handler struct {
	webSocketHub *WebSocketHub
	runner       Runner
	resultsDir   string
}

// NewHandler returns a new Handler with default options
func NewHandler(hub *WebSocketHub, runner Runner, resultsDir string) *Handler {
	return &Handler{
		webSocketHub: hub,
		runner:       runner,
		resultsDir:   resultsDir,
	}
}

// IndexHTML handle GET / request
func (h *Handler) IndexHTML(c echo.Context) error {
	data, err := Asset("assets/index.html")
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err.Error())
	}
	return c.HTMLBlob(http.StatusOK, data)
}

// PostAttack handle POST /api/attack request
func (h *Handler) PostAttack(c echo.Context) error {
	opts := NewAttackOptions()

	if err := c.Bind(opts); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	worker, err := opts.GetAttackWorker(h.webSocketHub)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if err := h.runner.Run(worker); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, opts)
}

// StopAttack handle DELETE /api/attack request
func (h *Handler) StopAttack(c echo.Context) error {
	if ok := h.runner.Stop(); !ok {
		return c.JSON(http.StatusOK, map[string]string{
			"message": "failed to stop the attack",
		})
	}
	return c.JSON(http.StatusOK, map[string]string{
		"message": "stop the attack",
	})
}

// ShowResultFiles handle GET /api/results/files
func (h *Handler) ShowResultFiles(c echo.Context) error {
	files, err := ioutil.ReadDir(h.resultsDir)
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

	sort.Sort(sort.Reverse(sort.StringSlice(paths)))

	return c.JSON(http.StatusOK, paths)
}

// ShowReport handle GET /api/reports/:filename
func (h *Handler) ShowReport(c echo.Context) error {
	filename := c.Param("filename")
	file, err := os.Open(filepath.Join(h.resultsDir, filename))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	defer file.Close()

	results, err := ParseResultsFromFile(file)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	var buf bytes.Buffer
	if err := NewJSONMultiReporter(results).Report(&buf); err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	return c.JSONBlob(http.StatusOK, buf.Bytes())
}
