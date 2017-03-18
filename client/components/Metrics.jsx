import React from 'react';

const floatFormat = (number, n) => {
  const p = Math.pow(10, n); // eslint-disable-line
  return Math.round(number * p) / p;
};
const nanoToMilli = (nano, n) => floatFormat((nano / Math.pow(1000, 2)), n); // eslint-disable-line
const nanoToSec = (nano, n) => floatFormat((nano / Math.pow(1000, 3)), n); // eslint-disable-line
const statusCodes = codes => Object.keys(codes).map(key => `${key}:${codes[key]}`).join(',');

const divider = <span style={{ display: 'inline-block', width: 4 }} />;
const errors = (metrics) => {
  if (!metrics.errors) {
    return (
      <article className="message is-primary">
        <div className="message-body">No Error</div>
      </article>
    );
  }
  return (
    <article className="message is-danger">
      <div className="message-body">
        {metrics.errors.map(err => (
          <div key={err}>{err}</div>
        ))}
      </div>
    </article>
  );
};

const Metrics = ({ metrics }) => (
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
      <tr>
        <th>Error Set</th>
        <td colSpan="2">{errors(metrics)}</td>
      </tr>
    </tbody>
  </table>
);

Metrics.propTypes = {
  metrics: React.PropTypes.object.isRequired,
};

export default Metrics;
