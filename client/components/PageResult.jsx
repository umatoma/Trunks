import React from 'react';
import ChartResults from './Charts/ChartResults';
import ChartHistgram from './Charts/ChartHistgram';
import Metrics from './Metrics';
import Results from './Results';

class PageResult extends React.Component {
  constructor() {
    super();
    this.handleClickShowResultList = this.handleClickShowResultList.bind(this);
  }

  componentDidMount() {
    this.props.onMount(this.props.filename);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filename !== this.props.filename) {
      this.props.onMount(nextProps.filename);
    }
  }

  handleClickShowResultList() {
    this.props.onShowResultList(this.props.filename);
  }

  sectionResults() {
    const { report } = this.props;
    if (report.showResultList) {
      return <Results results={report.results} />;
    }
    return (
      <button
        className="button is-primary is-outlined is-fullwidth"
        onClick={this.handleClickShowResultList}
      >
        <span className="icon is-small">
          <i className="fa fa-list" />
        </span>
        <span>Display the list of result</span>
      </button>
    );
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
          <div className="columns">
            <div className="column is-8">
              <ChartHistgram histgram={report.histgram} />
            </div>
          </div>
        </section>
        <section className="section">
          <Metrics metrics={report.metrics} />
        </section>
        <section className="section">
          {this.sectionResults()}
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
  onShowResultList: React.PropTypes.func.isRequired,
  report: React.PropTypes.shape({
    isFetching: React.PropTypes.bool.isRequired,
    results: React.PropTypes.object.isRequired,
    metrics: React.PropTypes.object.isRequired,
  }),
};

export default PageResult;
