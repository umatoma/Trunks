import React from 'react';

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

    return (
      <div>
        <section className="section">
          <h1 className="title">{filename}</h1>
        </section>
        <section className="section">
          {detail.results.map(res => (
            <div>{res.Timestamp} {res.Latency}</div>
          ))}
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
  detail: React.PropTypes.object,
};

export default PageResult;
