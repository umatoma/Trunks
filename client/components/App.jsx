import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import TitleBanner from './TitleBanner';
import SideMenu from './SideMenu';
import Notifications from './Notifications';
import PageAttack from './PageAttack';
import PageResult from './PageResult';
import WebSocketClient from '../lib/websocket-client';
import Dispatcher from '../dispatcher';
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

    const getState = () => this.state;
    this.dispatcher = new Dispatcher(this.setState.bind(this), getState.bind(this));
    this.state = this.dispatcher.getInitialState({ webSocketClient });

    this.handleDissmissNotify = this.handleDissmissNotify.bind(this);
    this.handlePageResultMount = this.handlePageResultMount.bind(this);
  }

  componentDidMount() {
    this.fetchResultFile();
  }

  fetchResultFile() {
    return getResultFiles()
      .then((files) => {
        this.dispatcher.setResultFiles(files);
      })
      .catch(() => {
        this.dispatcher.addNotify('failed to fetch result files');
      });
  }

  fetchReport(filename) {
    return getReport(filename)
      .then(({ metrics, results }) => {
        this.dispatcher.setReportData(filename, metrics, results);
      })
      .catch((err) => {
        this.dispatcher.setReportDataError(filename, err);
      });
  }

  handleCloseWebSocket() {
    this.dispatcher.addNotify('WebSocket connection closed');
  }

  handleAttackStart(data) {
    this.dispatcher.startAttack(data);
  }

  handleAttackFinish(data) {
    this.dispatcher.finishAttack(data.filename);
    this.fetchResultFile();
  }

  handleAttackMetrics(data) {
    this.dispatcher.setAttackMetrics(data);
  }

  handleDissmissNotify(notification) {
    this.dispatcher.removeNotify(notification);
  }

  handlePageResultMount(filename) {
    this.dispatcher.initReportData(filename);
    this.fetchReport(filename);
  }

  render() {
    const { worker, metrics, resultFiles, reports, formAttack } = this.state;
    return (
      <Router>
        <div>
          <Header />
          <TitleBanner />
          <div className="container">
            <div className="columns">
              <div className="column is-3">
                <SideMenu resultFiles={resultFiles} path={location.pathname} />
              </div>
              {/* End of column */}
              <div className="column is-9">
                <Route
                  exact path="/" render={() => (
                    <PageAttack
                      worker={worker}
                      metrics={metrics}
                      formAttack={formAttack}
                      addNotify={this.dispatcher.addNotify}
                      updateFormAttack={this.dispatcher.updateFormAttack}
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
