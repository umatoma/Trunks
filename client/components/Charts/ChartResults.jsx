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
    this.handleOnClickDownload = this.handleOnClickDownload.bind(this);
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

  handleOnClickDownload() {
    const url = this.canvas
      .toDataURL('image/png')
      .replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    const a = document.createElement('a');
    a.setAttribute('download', 'trunks-plot.png');
    a.setAttribute('href', url);
    a.click();
  }

  render() {
    return (
      <div>
        <canvas ref={(ref) => { this.canvas = ref; }} />
        <button
          className="button is-primary is-inverted is-pulled-right is-small"
          onClick={this.handleOnClickDownload}
        >
          <span className="icon is-small">
            <i className="fa fa-download" />
          </span>
          <span>Download as PNG</span>
        </button>
      </div>
    );
  }
}

ChartResults.propTypes = {
  results: React.PropTypes.object.isRequired,
};

export default ChartResults;
