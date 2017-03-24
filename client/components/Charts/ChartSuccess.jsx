import React from 'react';
import ChartC3 from './ChartC3';

const propsToChartConfig = ({ metrics }) => {
  const successes = ['Success', metrics.success];
  const errors = ['Error', 1.0 - metrics.success];
  return {
    data: {
      type: 'donut',
      columns: [
        successes,
        errors,
      ],
      colors: {
        Success: 'hsla(141, 71%, 48%, .9)',
        Error: 'hsla(348, 100%, 61%, .7)',
      },
    },
    donut: {
      title: 'Success ratio',
    },
  };
};

class ChartSuccess extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.metrics !== this.props.metrics) {
      return true;
    }
    return false;
  }

  render() {
    return <ChartC3 config={propsToChartConfig(this.props)} />;
  }
}

ChartSuccess.propTypes = {
  metrics: React.PropTypes.object.isRequired,
};

export default ChartSuccess;
