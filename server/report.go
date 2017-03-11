package main

import (
	"os"
	"io"

	vegeta "github.com/tsenart/vegeta/lib"
)

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
