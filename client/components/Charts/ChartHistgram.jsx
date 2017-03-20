import React from 'react';
import c3 from 'c3';

const histgramToLoadData = (histgram) => {
  const histgramArray = histgram.toArray();
  const xLabels = ['x'].concat(histgramArray.map(h => `${h.lo} - ${h.hi}`));
  const counts = ['Count'].concat(histgramArray.map(h => h.count));
  const ratios = ['Ratio'].concat(histgramArray.map(h => h.ratio));
  return {
    columns: [
      xLabels,
      counts,
      ratios,
    ],
    axes: {
      Ratio: 'y2',
    },
  };
};

const chartOptions = {
  bindto: '#chart_histgram',
  data: {
    type: 'bar',
    x: 'x',
    columns: [],
    colors: {
      Count: 'hsla(271, 100%, 71%, .9)',
      Ratio: 'hsla(217, 71%, 53%, .9)',
    },
  },
  grid: {
    y: {
      show: true,
    },
  },
  axis: {
    x: {
      type: 'category',
      label: {
        text: 'Latency (low - high)',
        position: 'outer-bottom',
      },
    },
    y: {
      label: {
        text: 'Count',
        position: 'outer-middle',
      },
    },
    y2: {
      show: true,
      label: {
        text: 'Ratio [%]',
        position: 'outer-middle',
      },
    },
  },
};

class ChartHistgram extends React.Component {
  componentDidMount() {
    this.chart = c3.generate(chartOptions);
    this.chart.load(histgramToLoadData(this.props.histgram));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.histgram !== this.props.histgram) {
      this.chart.load(histgramToLoadData(this.props.histgram));
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart = this.chart.destroy();
    }
  }

  render() {
    return <div id="chart_histgram" />;
  }
}

ChartHistgram.propTypes = {
  histgram: React.PropTypes.object.isRequired,
};

export default ChartHistgram;
