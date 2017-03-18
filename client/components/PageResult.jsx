import React from 'react';
import ChartResults from './Charts/ChartResults';
import Metrics from './Metrics';

class PageResult extends React.Component {
  componentDidMount() {
    this.props.onMount(this.props.filename);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filename !== this.props.filename) {
      this.props.onMount(nextProps.filename);
    }
  }

  sectionBody() {
    const { report } = this.props;

    if (!report || report.isFetching !== false) {
      return (
        <section className="section">
          <div className="tk-load-spinner" />
        </section>
      );
    }

    if (report.error) {
      return (
        <section className="section">
          <article className="message is-danger">
            <div className="message-body">{report.error.message}</div>
          </article>
        </section>
      );
    }

    return (
      <div>
        <section className="section">
          <ChartResults results={report.results} />
        </section>
        <section className="section">
          <Metrics metrics={report.metrics} />
        </section>
      </div>
    );
  }

  render() {
    const { filename } = this.props;
    return (
      <div>
        <section className="section">
          <h1 className="title">{filename}</h1>
        </section>
        {this.sectionBody()}
      </div>
    );
  }
}

PageResult.defaultProps = {
  report: null,
};

PageResult.propTypes = {
  filename: React.PropTypes.string.isRequired,
  onMount: React.PropTypes.func.isRequired,
  report: React.PropTypes.shape({
    isFetching: React.PropTypes.bool.isRequired,
    results: React.PropTypes.array.isRequired,
    metrics: React.PropTypes.object.isRequired,
  }),
};

export default PageResult;
