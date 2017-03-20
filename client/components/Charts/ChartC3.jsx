import React from 'react';
import { findDOMNode } from 'react-dom';
import c3 from 'c3';

class ChartC3 extends React.Component {
  componentDidMount() {
    this.updateChart(this.props.config);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.config !== this.props.config) {
      this.updateChart(nextProps.config);
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart = this.chart.destroy();
    }
  }

  updateChart(config) {
    if (!this.chart) {
      this.chart = c3.generate(Object.assign({}, config, { bindto: findDOMNode(this) }));
    } else {
      this.chart.load(config.data);
    }
  }

  render() {
    return <div />;
  }
}

ChartC3.propTypes = {
  config: React.PropTypes.shape({
    data: React.PropTypes.object.isRequired,
  }).isRequired,
};

export default ChartC3;
