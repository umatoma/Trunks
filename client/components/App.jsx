import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { OrderedSet, List, Map } from 'immutable';
import Header from './Header';
import Footer from './Footer';
import TitleBanner from './TitleBanner';
import SideMenu from './SideMenu';
import Notifications from './Notifications';
import PageAttack from './PageAttack';
import PageResult from './PageResult';
import WebSocketClient from '../lib/websocket-client';
import { ModelWorker, ModelMetrics, ModelReport } from '../models';
import { getResultFiles, getReport } from '../lib/api-client';

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
      worker: new ModelWorker(),
      metrics: new ModelMetrics(),
      resultFiles: List(),
      reports: Map(),
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

  fetchReport(filename) {
    return getReport(filename)
      .then(({ metrics, results }) => {
        const { reports } = this.state;
        this.setState({
          reports: reports.update(filename, (d) => { // eslint-disable-line
            return d.set('isFetching', false)
              .set('metrics', new ModelMetrics(metrics))
              .set('results', results);
          }),
        });
      })
      .catch((err) => {
        const { reports } = this.state;
        this.setState({
          reports: reports.update(filename, (d) => { // eslint-disable-line
            return d.set('isFetching', false).set('error', err);
          }),
        });
      });
  }

  handleCloseWebSocket() {
    this.addNotify('WebSocket connection closed');
  }

  handleAttackStart(data) {
    this.setState({
      worker: new ModelWorker(Object.assign({ status: 'active', filename: '' }, data)),
      metrics: new ModelMetrics(),
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
      metrics: new ModelMetrics(data),
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
      reports: this.state.reports.set(filename, new ModelReport()),
    });
    this.fetchReport(filename);
  }

  render() {
    const { worker, metrics, resultFiles, reports } = this.state;
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
                      report={reports.get(match.params.filename)}
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
