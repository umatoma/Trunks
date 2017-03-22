package server

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo"
	"github.com/stretchr/testify/assert"
)

type fakeWorkerRunner struct {}

type fakeHandler struct {
	Handler
}

func (h *fakeWorkerRunner) Run(w *AttackWorker, baseDir string) error {
	return nil
}

func (h *fakeWorkerRunner) Stop() bool {
	return true
}

func TestValidateOptions(t *testing.T) {
	h := &Handler{}

	h.ResultsDir = ""
	assert.Error(t, h.ValidateOptions(), "results dir should not be empty")
	h.ResultsDir = "_results"
	assert.Nil(t, h.ValidateOptions())
}

func TestIndexHTML(t *testing.T) {
	e := echo.New()
	req := new(http.Request)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/")
	h := &Handler{ResultsDir: "_results"}

	if assert.NoError(t, h.IndexHTML(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
	}
}

func TestPostAttack(t *testing.T) {
	e := echo.New()
	body, _ := json.Marshal(map[string]interface{}{
		"Targets":  "GET https://localhost:8000/",
		"Duration": "10s",
		"Rate":     2,
	})
	req, err := http.NewRequest(echo.POST, "/api/attack", bytes.NewReader(body))
	if assert.NoError(t, err) {
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		h := &fakeHandler{
			Handler{
				ResultsDir: "_results",
				workerRunner: &fakeWorkerRunner{},
			},
		}

		if assert.NoError(t, h.PostAttack(c)) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	}
}

func TestStopAttack(t *testing.T) {
	e := echo.New()
	req, err := http.NewRequest(echo.DELETE, "/api/attack", bytes.NewReader([]byte("")))
	if assert.NoError(t, err) {
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		h := &fakeHandler{
			Handler{
				ResultsDir: "_results",
				workerRunner: &fakeWorkerRunner{},
			},
		}

		if assert.NoError(t, h.StopAttack(c)) {
			assert.Equal(t, http.StatusOK, rec.Code)
			assert.JSONEq(t, `{"message":"stop the attack"}`, rec.Body.String())
		}
	}
}

func TestShowResultFiles(t *testing.T) {
	e := echo.New()
	req := new(http.Request)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/api/results/files")
	h := &Handler{ResultsDir: "fixtures"}

	if assert.NoError(t, h.ShowResultFiles(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.JSONEq(t, `["1490012362.bin", "1489982840.bin"]`, rec.Body.String())
	}
}

func TestShowReport(t *testing.T) {
	e := echo.New()
	req := new(http.Request)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/api/reports/:filename")
	c.SetParamNames("filename")
	c.SetParamValues("1490012362.bin")
	h := &Handler{ResultsDir: "fixtures"}

	if assert.NoError(t, h.ShowReport(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)

		body := new(map[string]interface{})
		json.Unmarshal(rec.Body.Bytes(), body)
		assert.Contains(t, *body, "histgram", "results", "metrics")
	}
}
