import React from 'react';
import c3 from 'c3';

const metricsToLoadData = (metrics) => {
  const errCount = metrics.errors ? metrics.errors.length : 0;
  const successes = ['Success', metrics.requests - errCount];
  const errors = ['Error', errCount];
  return {
    columns: [
      successes,
      errors,
    ],
  };
};

const chartOptions = {
  bindto: '#chart_success',
  data: {
    type: 'donut',
    columns: [],
    colors: {
      Success: 'hsla(141, 71%, 48%, .9)',
      Error: 'hsla(348, 100%, 61%, .7)',
    },
  },
  donut: {
    title: 'Success ratio',
  },
};

class ChartSuccess extends React.Component {
  componentDidMount() {
    this.chart = c3.generate(chartOptions);
    this.chart.load(metricsToLoadData(this.props.metrics));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.metrics !== this.props.metrics) {
      this.chart.load(metricsToLoadData(this.props.metrics));
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart = this.chart.destroy();
    }
  }

  render() {
    return <div id="chart_success" />;
  }
}

ChartSuccess.propTypes = {
  metrics: React.PropTypes.object.isRequired,
};

export default ChartSuccess;
