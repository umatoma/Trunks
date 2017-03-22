package server

import (
	"encoding/json"
	"io"
	"math"
	"os"
	"time"

	vegeta "github.com/tsenart/vegeta/lib"
)

// ParseResultsFromFile generate vegeta.Results from file
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
		histgram := &vegeta.Histogram{
			Buckets: reportBuckets(),
		}
		results := make([]map[string]interface{}, rs.Len())

		for i, r := range *rs {
			metrics.Add(&r)
			histgram.Add(&r)
			results[i] = resultRow(&r, rs)
		}
		metrics.Close()

		histRows := make([]map[string]interface{}, len(histgram.Counts))
		for j, count := range histgram.Counts {
			histRows[j] = histRow(histgram, j, count)
		}

		return json.NewEncoder(w).Encode(map[string]interface{}{
			"metrics":  metrics,
			"results":  results,
			"histgram": histRows,
		})
	}
}

func reportBuckets() vegeta.Buckets {
	return vegeta.Buckets{
		0 * time.Second,
		50 * time.Millisecond,
		100 * time.Millisecond,
		500 * time.Millisecond,
	}
}

func resultRow(r *vegeta.Result, rs *vegeta.Results) map[string]interface{} {
	return map[string]interface{}{
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

func histRow(h *vegeta.Histogram, i int, count uint64) map[string]interface{} {
	ratio := round(100 * float64(count) / float64(h.Total), 2)
	lo, hi := h.Buckets.Nth(i)
	return map[string]interface{}{
		"lo":    lo,
		"hi":    hi,
		"ratio": ratio,
		"count": count,
	}
}

func round(f float64, places int) float64 {
	shift := math.Pow(10, float64(places))
	return math.Floor(f*shift+.5) / shift
}
