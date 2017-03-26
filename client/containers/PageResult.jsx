import React from 'react';
import ChartResults from '../components/Charts/ChartResults';
import ChartHistgram from '../components/Charts/ChartHistgram';
import ChartSuccess from '../components/Charts/ChartSuccess';
import Metrics from '../components/Metrics';
import Results from '../components/Results';

class PageResult extends React.Component {
  constructor() {
    super();
    this.handleClickShowResultList = this.handleClickShowResultList.bind(this);
  }

  componentDidMount() {
    this.handleMount(this.props.filename);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filename !== this.props.filename) {
      this.handleMount(nextProps.filename);
    }
  }

  handleMount(filename) {
    this.props.dispatch('initReportData', filename);
    this.props.fetchReport(filename);
  }

  handleClickShowResultList() {
    this.props.dispatch('showResultList', this.props.filename);
  }

  renderResults() {
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

  renderBody() {
    const { report } = this.props;

    if (!report || report.isFetching !== false) {
      return (
        <div className="content">
          <div className="tk-load-spinner" />
        </div>
      );
    }

    if (report.error) {
      return (
        <div className="content">
          <article className="message is-danger">
            <div className="message-body">{report.error.message}</div>
          </article>
        </div>
      );
    }

    return (
      <div>
        <div className="content">
          <div className="columns">
            <div className="column is-12">
              <ChartResults results={report.results} />
            </div>
          </div>
          <div className="columns">
            <div className="column is-8">
              <ChartHistgram histgram={report.histgram} />
            </div>
            <div className="column is-4">
              <ChartSuccess metrics={report.metrics} />
            </div>
          </div>
        </div>
        <div className="content">
          <Metrics metrics={report.metrics} />
        </div>
        <div className="content">
          {this.renderResults()}
        </div>
      </div>
    );
  }

  render() {
    const { filename } = this.props;
    return (
      <div>
        <div className="content">
          <h1 className="title">{filename}</h1>
        </div>
        {this.renderBody()}
      </div>
    );
  }
}

PageResult.defaultProps = {
  report: null,
};

PageResult.propTypes = {
  filename: React.PropTypes.string.isRequired,
  report: React.PropTypes.shape({
    isFetching: React.PropTypes.bool.isRequired,
    results: React.PropTypes.object.isRequired,
    metrics: React.PropTypes.object.isRequired,
  }),
  fetchReport: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
};

export default PageResult;
