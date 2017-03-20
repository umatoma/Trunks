import React from 'react';
import ChartC3 from './ChartC3';

const propsToChartConfig = ({ results }) => {
  const resultsArray = results.toArray();
  const successes = ['Success'].concat(
    resultsArray.filter(r => !r.Error).map(r => r.LatencyMilliSec),
  );
  const errors = ['Error'].concat(
    resultsArray.filter(r => r.Error).map(r => r.LatencyMilliSec),
  );
  return {
    data: {
      columns: [
        successes,
        errors,
      ],
      types: {
        Success: 'area',
        Error: 'area-spline',
      },
      colors: {
        Success: 'hsla(141, 71%, 48%, .9)',
        Error: 'hsla(348, 100%, 61%, .7)',
      },
    },
    grid: {
      x: {
        show: true,
      },
      y: {
        show: true,
      },
    },
    axis: {
      x: {
        label: {
          text: 'Seconds elapsed [sec]',
          position: 'outer-bottom',
        },
      },
      y: {
        label: {
          text: 'Latency [ms]',
          position: 'outer-middle',
        },
      },
    },
  };
};

class ChartResults extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.results !== this.props.results) {
      return true;
    }
    return false;
  }

  render() {
    return <ChartC3 config={propsToChartConfig(this.props)} />;
  }
}

ChartResults.propTypes = {
  results: React.PropTypes.object.isRequired,
};

export default ChartResults;
