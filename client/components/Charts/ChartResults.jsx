import React from 'react';
import { findDOMNode } from 'react-dom';
import Chart from 'chart.js';

const resultsToChartData = (results) => {
  const resultsArray = results.toArray();
  const datasets = [
    {
      label: 'Latency',
      data: resultsArray.map(res => res.LatencyMilliSec),
      fill: true,
      backgroundColor: 'hsla(271, 100%, 71%, .5)',
      borderWidth: 1.5,
      borderColor: 'hsla(271, 100%, 71%, .8)',
    },
  ];
  const xLabels = resultsArray.map(res => res.ElapsedTime);
  return {
    type: 'line',
    data: {
      datasets,
      xLabels,
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Latency [ms]',
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Seconds elapsed [sec]',
            },
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 20,
            },
          },
        ],
      },
    },
  };
};

class ChartResults extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.chart = null;
  }

  componentDidMount() {
    const element = findDOMNode(this.canvas);
    const ctx = element.getContext('2d');
    this.chart = new Chart(ctx, resultsToChartData(this.props.results));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.results !== this.props.results) {
      const { data } = resultsToChartData(nextProps.results);
      this.chart.data.labels = data.labels;
      this.chart.data.datasets = data.datasets;
      this.chart.update();
    }
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    return <canvas ref={(ref) => { this.canvas = ref; }} />;
  }
}

ChartResults.propTypes = {
  results: React.PropTypes.object.isRequired,
};

export default ChartResults;
