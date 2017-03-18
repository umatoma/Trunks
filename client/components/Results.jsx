import React from 'react';

class Results extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.results !== this.props.results) {
      return true;
    }
    return false;
  }

  render() {
    const { results } = this.props;
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Timestamp</th>
            <th>Latency</th>
            <th>BytesOut</th>
            <th>BytesIn</th>
            <th>Error</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>Code</th>
            <th>Timestamp</th>
            <th>Latency</th>
            <th>BytesOut</th>
            <th>BytesIn</th>
            <th>Error</th>
          </tr>
        </tfoot>
        <tbody>
          {results.map(res => (
            <tr key={res.Timestamp}>
              <td>{res.Code}</td>
              <td>{res.TimeShort}</td>
              <td>{res.LatencyMilliSec}</td>
              <td>{res.BytesOut}</td>
              <td>{res.BytesIn}</td>
              <td>{res.Error}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

Results.propTypes = {
  results: React.PropTypes.array.isRequired,
};

export default Results;
