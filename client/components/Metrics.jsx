import React from 'react';
import { Link } from 'react-router-dom';

const floatFormat = (number, n) => {
  const p = Math.pow(10, n); // eslint-disable-line
  return Math.round(number * p) / p;
};
const nanoToMilli = (nano, n) => floatFormat((nano / Math.pow(1000, 2)), n); // eslint-disable-line
const nanoToSec = (nano, n) => floatFormat((nano / Math.pow(1000, 3)), n); // eslint-disable-line
const statusCodes = codes => Object.keys(codes).map(key => `${key}:${codes[key]}`).join(',');

class Metrics extends React.Component { // eslint-disable-line
  resultFileLink() {
    const { worker } = this.props;
    if (worker.status === 'done' && worker.filename) {
      return (
        <Link className="button is-primary is-outlined is-fullwidth" to={`/results/${worker.filename}`}>
          Check details
        </Link>
      );
    }
    return null;
  }

  workerProgress() {
    const { worker, metrics } = this.props;
    if (worker.status === 'active') {
      const prog = 100 * (metrics.requests / (worker.rate * (worker.duration / Math.pow(1000, 3)))); // eslint-disable-line
      return (
        <progress className="progress is-primary is-small" value={prog} max="100">{prog}%</progress>
      );
    }
    return null;
  }

  render() {
    const { worker, metrics } = this.props;

    if (worker.status !== 'active' && worker.status !== 'done') {
      return null;
    }

    const divider = <span style={{ display: 'inline-block', width: 4 }} />;
    return (
      <div>
        <table className="table">
          <tbody>
            <tr>
              <th>Requests</th>
              <td>[total, rate]</td>
              <td>
                <span className="tag">{metrics.requests}</span>
                {divider}
                <span className="tag">{floatFormat(metrics.rate, 2)}</span>
              </td>
            </tr>
            <tr>
              <th>Duration</th>
              <td>[total, attack, wait]</td>
              <td>
                <span className="tag">{nanoToSec(metrics.duration + metrics.wait, 2)}s</span>
                {divider}
                <span className="tag">{nanoToSec(metrics.duration, 2)}s</span>
                {divider}
                <span className="tag">{nanoToSec(metrics.wait, 2)}s</span>
              </td>
            </tr>
            <tr>
              <th>Latencies</th>
              <td>[mean, 50, 95, 99, max]</td>
              <td>
                <span className="tag">{nanoToMilli(metrics.latencies.mean, 2)}ms</span>
                {divider}
                <span className="tag">{nanoToMilli(metrics.latencies['50th'], 2)}ms</span>
                {divider}
                <span className="tag">{nanoToMilli(metrics.latencies['95th'], 2)}ms</span>
                {divider}
                <span className="tag">{nanoToMilli(metrics.latencies['99th'], 2)}ms</span>
                {divider}
                <span className="tag">{nanoToMilli(metrics.latencies.max, 2)}ms</span>
              </td>
            </tr>
            <tr>
              <th>Bytes In</th>
              <td>[total, mean]</td>
              <td>
                <span className="tag">{metrics.bytes_in.total}</span>
                {divider}
                <span className="tag">{metrics.bytes_in.mean}</span>
              </td>
            </tr>
            <tr>
              <th>Bytes Out</th>
              <td>[total, mean]</td>
              <td>
                <span className="tag">{metrics.bytes_out.total}</span>
                {divider}
                <span className="tag">{metrics.bytes_out.mean}</span>
              </td>
            </tr>
            <tr>
              <th>Success</th>
              <td>[ratio]</td>
              <td>
                <span className="tag">{metrics.success}%</span>
              </td>
            </tr>
            <tr>
              <th>Status Codes</th>
              <td>[code:count]</td>
              <td>
                <span className="tag">{statusCodes(metrics.status_codes)}</span>
              </td>
            </tr>
          </tbody>
        </table>
        {this.workerProgress()}
        {this.resultFileLink()}
      </div>
    );
  }
}

Metrics.propTypes = {
  worker: React.PropTypes.object.isRequired,
  metrics: React.PropTypes.object.isRequired,
};

export default Metrics;
