package server

import (
	"encoding/json"
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

func TestUnmarshalJSON(t *testing.T) {
	data :=
`{
	"Targets": "GET http://localhost:3000",
	"Body": "body_text",
	"Cert": "cert_text",
	"Key": "key_text",
	"RootCerts": "rott_certs_text",
	"HTTP2": false,
	"Insecure": true,
	"Lazy": true,
	"Duration": "10s",
	"Timeout": "20s",
	"Rate": 10,
	"Workers": 10,
	"Connections": 10000,
	"Redirects": 10,
	"Headers": "Content-Type: application/json",
	"Laddr": "127.0.0.1",
	"Keepalive": false
}`
	opts := NewAttackOptions()
	assert.Nil(t, json.Unmarshal([]byte(data), &opts))
	assert.Equal(t, "GET http://localhost:3000", opts.Targets)
	assert.Equal(t, "body_text", opts.Body)
	assert.Equal(t, "cert_text", opts.Cert)
	assert.Equal(t, "key_text", opts.Key)
	assert.Equal(t, false, opts.HTTP2)
	assert.Equal(t, true, opts.Insecure)
	assert.Equal(t, true, opts.Lazy)
	assert.Equal(t, "10s", opts.Duration)
	assert.Equal(t, "20s", opts.Timeout)
	assert.Equal(t, uint64(10), opts.Rate)
	assert.Equal(t, uint64(10), opts.Workers)
	assert.Equal(t, int(10000), opts.Connections)
	assert.Equal(t, int(10), opts.Redirects)
	assert.Equal(t, "application/json", opts.Headers.Get("Content-Type"))
	assert.Equal(t, "127.0.0.1", opts.Laddr.String())
	assert.Equal(t, false, opts.Keepalive)
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
