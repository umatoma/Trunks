import React from 'react';
import ChartC3 from './ChartC3';

const propsToChartConfig = ({ histgram }) => {
  const histgramArray = histgram.toArray();
  const xLabels = ['x'].concat(histgramArray.map(h => `${h.lo} - ${h.hi}`));
  const counts = ['Count'].concat(histgramArray.map(h => h.count));
  const ratios = ['Ratio'].concat(histgramArray.map(h => h.ratio));
  return {
    data: {
      type: 'bar',
      x: 'x',
      columns: [
        xLabels,
        counts,
        ratios,
      ],
      colors: {
        Count: 'hsla(271, 100%, 71%, .9)',
        Ratio: 'hsla(217, 71%, 53%, .9)',
      },
      axes: {
        Ratio: 'y2',
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
};

class ChartHistgram extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.histgram !== this.props.histgram) {
      return true;
    }
    return false;
  }

  render() {
    return <ChartC3 config={propsToChartConfig(this.props)} />;
  }
}

ChartHistgram.propTypes = {
  histgram: React.PropTypes.object.isRequired,
};

export default ChartHistgram;
