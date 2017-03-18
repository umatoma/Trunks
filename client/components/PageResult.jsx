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

  render() {
    const { filename, detail } = this.props;

    if (!detail || detail.isFetching !== false) {
      return (
        <section className="section">
          <div className="tk-load-spinner" />
        </section>
      );
    }

    if (detail.error) {
      return (
        <div>
          <section className="section">
            <h1 className="title">{filename}</h1>
          </section>
          <section className="section">
            <article className="message is-danger">
              <div className="message-body">{detail.error.message}</div>
            </article>
          </section>
        </div>
      );
    }

    return (
      <div>
        <section className="section">
          <h1 className="title">{filename}</h1>
        </section>
        <section className="section">
          <ChartResults results={detail.results} />
        </section>
        <section className="section">
          <Metrics metrics={detail.metrics} />
        </section>
      </div>
    );
  }
}

PageResult.defaultProps = {
  detail: null,
};

PageResult.propTypes = {
  filename: React.PropTypes.string.isRequired,
  onMount: React.PropTypes.func.isRequired,
  detail: React.PropTypes.shape({
    isFetching: React.PropTypes.bool.isRequired,
    results: React.PropTypes.array.isRequired,
    metrics: React.PropTypes.object.isRequired,
  }),
};

export default PageResult;
