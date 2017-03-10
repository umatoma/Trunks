package main

import (
	"time"
	"net"
	"net/http"

	vegeta "github.com/tsenart/vegeta/lib"
)

type csl []string

type headers struct{ http.Header }

type localAddr struct{ *net.IPAddr }

// AttackOptions aggregates the vegeta attack options
type AttackOptions struct {
	Targets			string
	Output			string
	Body				string
	Cert				string
	RootCerts		csl
	HTTP2				bool
	Insecure		bool
	Lazy				bool
	Duration		time.Duration
	Timeout			time.Duration
	Rate				uint64
	Workers			uint64
	Connections	int
	Redirects		int
	Headers			headers
	Laddr				localAddr
	Keepalive		bool
}

func NewAttackOptions() *AttackOptions {
	return &AttackOptions{
		HTTP2: true,
		Insecure: false,
		Lazy: false,
		Duration: 0,
		Timeout: vegeta.DefaultTimeout,
		Rate: 50,
		Workers: vegeta.DefaultWorkers,
		Connections: vegeta.DefaultConnections,
		Redirects: vegeta.DefaultRedirects,
		Headers: headers{http.Header{}},
		Laddr: localAddr{&vegeta.DefaultLocalAddr},
		Keepalive: true,
	}
}
