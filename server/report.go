package main

import (
	"os"
	"io"
	"encoding/json"

	vegeta "github.com/tsenart/vegeta/lib"
)

// NewJSONResultsReporter returns a Reporter that writes out Results as JSON
func NewJSONResultsReporter(rs *vegeta.Results) vegeta.Reporter {
	return func(w io.Writer) error {
		results := make([]map[string]interface{}, rs.Len())
		for i, r := range *rs {
			results[i] = map[string]interface{}{
				"Code": r.Code,
				"Timestamp": r.Timestamp,
				"Latency": r.Latency,
				"BytesOut": r.BytesOut,
				"BytesIn": r.BytesIn,
				"Error": r.Error,
				"ElapsedTime": r.Timestamp.Sub((*rs)[0].Timestamp).Seconds(),
				"LatencyMilliSec": r.Latency.Seconds() * 1000,
			}
		}
		return json.NewEncoder(w).Encode(results)
	}
}

// GetJSONResultsReporter make a vegeta.Repoter from file
func GetJSONResultsReporter(file *os.File) (vegeta.Reporter, error) {
	decoder := vegeta.NewDecoder(file)

	var reporter vegeta.Reporter
	var report vegeta.Report
	var rs vegeta.Results
	reporter, report = NewJSONResultsReporter(&rs), &rs

	for {
		var r vegeta.Result
		if err := decoder.Decode(&r); err != nil {
			if err == io.EOF {
				break
			}
			return nil, err
		}
		report.Add(&r)
	}

	if c, ok := report.(vegeta.Closer); ok {
		c.Close()
	}

	return reporter, nil
}

// GetPlotReporter make a vegeta.Repoter from file
func GetPlotReporter(file *os.File) (vegeta.Reporter, error) {
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
			return nil, err
		}
		report.Add(&r)
	}

	if c, ok := report.(vegeta.Closer); ok {
		c.Close()
	}

	return reporter, nil
}
