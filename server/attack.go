package main

import (
	"time"
	"net"
	"net/http"
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
