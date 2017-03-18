import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { OrderedSet, Record, List, Map } from 'immutable';
import Header from './Header';
import Footer from './Footer';
import TitleBanner from './TitleBanner';
import SideMenu from './SideMenu';
import Notifications from './Notifications';
import PageAttack from './PageAttack';
import PageResult from './PageResult';
import WebSocketClient from '../lib/websocket-client';
import { getResultFiles, getReport } from '../lib/api-client';

const Worker = Record({
  status: 'ready',
  duration: 0,
  rate: 0,
  filename: '',
});

const MetricsModel = Record({
  bytes_in: { total: 0, mean: 0 },
  bytes_out: { total: 0, mean: 0 },
  duration: 0,
  earliest: '',
  end: '',
  errors: [],
  latencies: { mean: 0, max: 0, '50th': 0, '95th': 0, '99th': 0 },
  latest: {},
  rate: 0,
  requests: 0,
  status_codes: {},
  success: 0,
  wait: 0,
});

const ResultDetail = Record({
  isFetching: true,
  results: [],
});

class App extends React.Component {
  constructor() {
    super();

    // create websocket connection
    const webSocketClient = new WebSocketClient(`ws://${document.location.host}/ws`);
    webSocketClient.onClose(this.handleCloseWebSocket.bind(this));
    webSocketClient.onAttackStart(this.handleAttackStart.bind(this));
    webSocketClient.onAttackFinish(this.handleAttackFinish.bind(this));
    webSocketClient.onAttackMetrics(this.handleAttackMetrics.bind(this));

    this.state = {
      webSocketClient,
      notifications: OrderedSet(),
      worker: new Worker(),
      metrics: new MetricsModel(),
      resultFiles: List(),
      resultDetails: Map(),
    };

    this.addNotify = this.addNotify.bind(this);
    this.handleDissmissNotify = this.handleDissmissNotify.bind(this);
    this.handlePageResultMount = this.handlePageResultMount.bind(this);
  }

  componentDidMount() {
    this.fetchResultFile();
  }

  fetchResultFile() {
    return getResultFiles()
      .then((files) => { this.setState({ resultFiles: List(files) }); })
      .catch(() => { this.addNotify('failed to fetch result files'); });
  }

  fetchResultDetail(filename) {
    return getReport(filename)
      .then((results) => {
        const { resultDetails } = this.state;
        this.setState({
          resultDetails: resultDetails.update(filename, (d) => { // eslint-disable-line
            return d.set('isFetching', false).set('results', results);
          }),
        });
      })
      .catch(() => { this.addNotify('failed to fetch result data'); });
  }

  handleCloseWebSocket() {
    this.addNotify('WebSocket connection closed');
  }

  handleAttackStart(data) {
    this.setState({
      worker: new Worker(Object.assign({ status: 'active', filename: '' }, data)),
      metrics: new MetricsModel(),
    });
  }

  handleAttackFinish(data) {
    this.setState({
      worker: this.state.worker.set('status', 'done').set('filename', data.filename),
    });
    this.fetchResultFile();
  }

  handleAttackMetrics(data) {
    this.setState({
      metrics: new MetricsModel(data),
    });
  }

  addNotify(message, type = 'primary') {
    this.setState({
      notifications: this.state.notifications.add({ key: Date.now(), message, type }),
    });
  }

  handleDissmissNotify(notification) {
    this.setState({
      notifications: this.state.notifications.delete(notification),
    });
  }

  handlePageResultMount(filename) {
    this.setState({
      resultDetails: this.state.resultDetails.set(filename, new ResultDetail()),
    });
    this.fetchResultDetail(filename);
  }

  render() {
    const { worker, metrics, resultFiles, resultDetails } = this.state;
    return (
      <Router>
        <div>
          <Header />
          <TitleBanner />
          <div className="container">
            <div className="columns">
              <div className="column is-3">
                <SideMenu resultFiles={resultFiles} />
              </div>
              {/* End of column */}
              <div className="column is-9">
                <Route
                  exact path="/" render={() => (
                    <PageAttack
                      worker={worker}
                      metrics={metrics}
                      addNotify={this.addNotify}
                    />
                  )}
                />
                <Route
                  path="/results/:filename" render={({ match }) => (
                    <PageResult
                      filename={match.params.filename}
                      detail={resultDetails.get(match.params.filename)}
                      onMount={this.handlePageResultMount}
                    />
                  )}
                />
              </div>
              {/* End of column */}
            </div>
            {/* End of columns */}
          </div>
          {/* End of container */}
          <Notifications
            notifications={this.state.notifications.toArray()}
            onDissmiss={this.handleDissmissNotify}
          />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
