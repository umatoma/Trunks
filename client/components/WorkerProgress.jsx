import React from 'react';

const percentage = (w, m) => 100 * (m.requests / (w.rate * (w.duration / Math.pow(1000, 3)))); // eslint-disable-line

class WorkerProgress extends React.Component { // eslint-disable-line
  render() {
    const { worker, metrics } = this.props;
    const per = percentage(worker, metrics);
    return (
      <progress className="progress is-primary is-small" value={per} max="100">
        {per}%
      </progress>
    );
  }
}

WorkerProgress.propTypes = {
  worker: React.PropTypes.object.isRequired,
  metrics: React.PropTypes.object.isRequired,
};

export default WorkerProgress;
