import React from 'react';

const floatFormat = (number, n) => {
  const p = 10 ** n;
  return Math.round(number * p) / p;
};
const nanoToMilli = (nano, n) => floatFormat((nano / (1000 ** 2)), n);
const nanoToSec = (nano, n) => floatFormat((nano / (1000 ** 3)), n);
const statusCodes = codes => Object.keys(codes).map(key => `${key}:${codes[key]}`).join(',');

const Metrics = ({ metrics }) => (
  <table className="table">
    <tbody>
      <tr>
        <th>Requests</th>
        <td>[total, rate]</td>
        <td>
          {metrics.requests},
          {floatFormat(metrics.rate, 2)}
        </td>
      </tr>
      <tr>
        <th>Duration</th>
        <td>[total, attack, wait]</td>
        <td>
          {nanoToSec(metrics.duration + metrics.wait, 2)}s,
          {nanoToSec(metrics.duration, 2)}s,
          {nanoToSec(metrics.wait, 2)}s
        </td>
      </tr>
      <tr>
        <th>Latencies</th>
        <td>[mean, 50, 95, 99, max]</td>
        <td>
          {nanoToMilli(metrics.latencies.mean, 2)}ms,
          {nanoToMilli(metrics.latencies['50th'], 2)}ms,
          {nanoToMilli(metrics.latencies['95th'], 2)}ms,
          {nanoToMilli(metrics.latencies['99th'], 2)}ms,
          {nanoToMilli(metrics.latencies.max, 2)}ms
        </td>
      </tr>
      <tr>
        <th>Bytes In</th>
        <td>[total, mean]</td>
        <td>
          {metrics.bytes_in.total},
          {metrics.bytes_in.mean}
        </td>
      </tr>
      <tr>
        <th>Bytes Out</th>
        <td>[total, mean]</td>
        <td>
          {metrics.bytes_out.total},
          {metrics.bytes_out.mean}
        </td>
      </tr>
      <tr>
        <th>Success</th>
        <td>[ratio]</td>
        <td>{metrics.success}%</td>
      </tr>
      <tr>
        <th>Status Codes</th>
        <td>[code:count]</td>
        <td>{statusCodes(metrics.status_codes)}</td>
      </tr>
    </tbody>
  </table>
);

Metrics.propTypes = {
  metrics: React.PropTypes.object.isRequired,
};

export default Metrics;
