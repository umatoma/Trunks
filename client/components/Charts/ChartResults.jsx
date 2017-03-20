import React from 'react';
import c3 from 'c3';

const resultsToLoadData = (results) => {
  const resultsArray = results.toArray();
  const successes = ['Success'].concat(
    resultsArray.filter(r => !r.Error).map(r => r.LatencyMilliSec),
  );
  const errors = ['Error'].concat(
    resultsArray.filter(r => r.Error).map(r => r.LatencyMilliSec),
  );
  return {
    columns: [
      successes,
      errors,
    ],
  };
};

const chartOptions = {
  bindto: '#chart_results',
  data: {
    columns: [],
    colors: {
      Success: 'hsla(141, 71%, 48%, .8)',
      Error: 'hsla(348, 100%, 61%, .8)',
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

class ChartResults extends React.Component {
  componentDidMount() {
    this.chart = c3.generate(chartOptions);
    this.chart.load(resultsToLoadData(this.props.results));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.results !== this.props.results) {
      this.chart.load(resultsToLoadData(this.props.results));
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart = this.chart.destroy();
    }
  }

  render() {
    return <div id="chart_results" />;
  }
}

ChartResults.propTypes = {
  results: React.PropTypes.object.isRequired,
};

export default ChartResults;
