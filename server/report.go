package main

import (
	"encoding/json"
	"io"
	"math"
	"os"

	vegeta "github.com/tsenart/vegeta/lib"
)

func ParseResultsFromFile(file *os.File) (*vegeta.Results, error) {
	decoder := vegeta.NewDecoder(file)

	results := &vegeta.Results{}

	for {
		var r vegeta.Result
		if err := decoder.Decode(&r); err != nil {
			if err == io.EOF {
				break
			}
			return nil, err
		}
		results.Add(&r)
	}

	results.Close()

	return results, nil
}

// NewJSONMultiReporter returns a Reporter that writes out metrics and results as JSON
func NewJSONMultiReporter(rs *vegeta.Results) vegeta.Reporter {
	return func(w io.Writer) error {
		metrics := &vegeta.Metrics{}
		results := make([]map[string]interface{}, rs.Len())
		for i, r := range *rs {
			metrics.Add(&r)
			results[i] = map[string]interface{}{
				"Code":            r.Code,
				"Timestamp":       r.Timestamp,
				"Latency":         r.Latency,
				"BytesOut":        r.BytesOut,
				"BytesIn":         r.BytesIn,
				"Error":           r.Error,
				"TimeShort":       r.Timestamp.Format("15:04:05"),
				"ElapsedTime":     round(r.Timestamp.Sub((*rs)[0].Timestamp).Seconds(), 2),
				"LatencyMilliSec": round(r.Latency.Seconds()*1000, 2),
			}
		}
		metrics.Close()
		return json.NewEncoder(w).Encode(map[string]interface{}{
			"metrics": metrics,
			"results": results,
		})
	}
}

// PlotReporterFactory make a vegeta.Repoter from file
func PlotReporterFactory(file *os.File) (vegeta.Reporter, error) {
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

func round(f float64, places int) float64 {
	shift := math.Pow(10, float64(places))
	return math.Floor(f*shift+.5) / shift
}
