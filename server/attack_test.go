package main

import (
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	vegeta "github.com/tsenart/vegeta/lib"
)

type BroadcasterMock struct{}

func (m *BroadcasterMock) Broadcast(event string, data interface{}) error {
	return nil
}

func TestGetAttackWorker(t *testing.T) {
	opts := NewAttackOptions()
	opts.Targets = "GET http://localhost:3000/\nX-Trunks: xyz"
	opts.Rate = 5
	opts.Duration = "10s"
	opts.Body = "abcdefg"

	w, err := opts.GetAttackWorker(&BroadcasterMock{})
	assert.Nil(t, err)
	assert.NotNil(t, w.attacker)
	assert.NotNil(t, w.targeter)
	assert.Equal(t, w.rate, uint64(5))
	assert.Equal(t, w.duration.String(), "10s")

	var tgt vegeta.Target
	w.targeter(&tgt)
	assert.Equal(t, tgt.Method, "GET")
	assert.Equal(t, tgt.URL, "http://localhost:3000/")
	assert.Equal(t, tgt.Header, http.Header{"X-Trunks": []string{"xyz"}})
	assert.Equal(t, tgt.Body, []byte("abcdefg"))
}

func TestTargets(t *testing.T) {
	opts := NewAttackOptions()

	opts.Targets = ""
	_, err := opts.GetAttackWorker(&BroadcasterMock{})
	assert.NotNil(t, err)

	opts.Targets = "GET http://localhost:3000/"
	_, err = opts.GetAttackWorker(&BroadcasterMock{})
	assert.Nil(t, err)
}

func TestRate(t *testing.T) {
	opts := NewAttackOptions()
	opts.Targets = "GET http://localhost:3000/"

	opts.Rate = 0
	_, err := opts.GetAttackWorker(&BroadcasterMock{})
	assert.NotNil(t, err)

	opts.Rate = 1
	_, err = opts.GetAttackWorker(&BroadcasterMock{})
	assert.Nil(t, err)
}

func TestTimeout(t *testing.T) {
	opts := NewAttackOptions()
	opts.Targets = "GET http://localhost:3000/"

	opts.Timeout = "invalid"
	_, err := opts.GetAttackWorker(&BroadcasterMock{})
	assert.NotNil(t, err)

	opts.Timeout = "10s"
	_, err = opts.GetAttackWorker(&BroadcasterMock{})
	assert.Nil(t, err)
}
