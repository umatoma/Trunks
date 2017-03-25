import React from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import TitleBanner from './TitleBanner';
import SideMenu from './SideMenu';
import Notifications from './Notifications';
import PageAttack from './PageAttack';
import PageResult from './PageResult';
import WebSocketClient from '../lib/websocket-client';
import { getResultFiles, getReport } from '../lib/api-client';
import Dispatcher from '../state/dispatcher';
import * as actions from '../state/actions';
import { getMiddlewares } from '../state/middlewares';
import { getInitialState } from '../state/models';

const SideMenuWithRouter = withRouter(SideMenu);

class App extends React.Component {
  constructor() {
    super();

    // create websocket connection
    const webSocketClient = new WebSocketClient(`ws://${document.location.host}/ws`);
    webSocketClient.onClose(this.handleCloseWebSocket.bind(this));
    webSocketClient.onAttackStart(this.handleAttackStart.bind(this));
    webSocketClient.onAttackFinish(this.handleAttackFinish.bind(this));
    webSocketClient.onAttackCancel(this.handleAttackCancel.bind(this));
    webSocketClient.onAttackFail(this.handleAttackFail.bind(this));
    webSocketClient.onAttackMetrics(this.handleAttackMetrics.bind(this));
    this.webSocketClient = webSocketClient;

    // set dispatcher
    this.dispatcher = new Dispatcher(
      this.setState.bind(this),
      this.getState.bind(this),
      actions,
      getMiddlewares(),
    );

    // initialize state
    this.state = getInitialState();

    // bind context
    this.dispatch = this.dispatch.bind(this);
    this.handleDissmissNotify = this.handleDissmissNotify.bind(this);
    this.handlePageResultMount = this.handlePageResultMount.bind(this);
  }

  componentDidMount() {
    this.fetchResultFile();
  }

  /**
   * return current state
   * @return {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * call dispatcher.dispatch
   * @param {String} eventName
   * @param {Any} params
   */
  dispatch(eventName, params) {
    this.dispatcher.dispatch(eventName, params);
  }

  fetchResultFile() {
    return getResultFiles()
      .then((files) => {
        this.dispatch('setResultFiles', files);
      })
      .catch(() => {
        this.dispatch('addNotify', { message: 'failed to fetch result files' });
      });
  }

  fetchReport(filename) {
    return getReport(filename)
      .then((report) => {
        this.dispatch('setReportData', Object.assign({ filename }, report));
      })
      .catch((error) => {
        this.dispatch('setReportDataError', { filename, error });
      });
  }

  handleCloseWebSocket() {
    this.dispatch('addNotify', { message: 'WebSocket connection closed' });
  }

  handleAttackStart(data) {
    this.dispatch('startAttack', data);
  }

  handleAttackFinish(data) {
    this.dispatch('finishAttack', data.filename);
    this.fetchResultFile();
  }

  handleAttackCancel() {
    this.dispatch('cancelAttack');
  }

  handleAttackFail(data) {
    this.dispatch('failAttack', new Error(data.message));
  }

  handleAttackMetrics(data) {
    this.dispatch('updateAttackMetrics', data);
  }

  handleDissmissNotify(notification) {
    this.dispatch('removeNotify', notification);
  }

  handlePageResultMount(filename) {
    this.dispatch('initReportData', filename);
    this.fetchReport(filename);
  }

  render() {
    const { dispatch } = this;
    const {
      header,
      sideMenu,
      worker,
      metrics,
      resultFiles,
      reports,
      formAttack,
      importOption,
    } = this.state;

    return (
      <Router>
        <div>
          <Header
            isHamburgerActive={header.isHamburgerActive}
            onToggleHamburger={() => dispatch('toggleHeaderHamburger')}
          />
          <TitleBanner />
          <section className="section">
            <div className="container">
              <div className="columns">
                <div className="column is-3">
                  <SideMenuWithRouter
                    resultFiles={resultFiles}
                    isModalActive={sideMenu.isModalActive}
                    onToggleModal={() => dispatch('toggleSideMenuModal')}
                  />
                </div>
                {/* End of column */}
                <div className="column is-9">
                  <Route
                    exact path="/" render={() => (
                      <PageAttack
                        worker={worker}
                        metrics={metrics}
                        formAttack={formAttack}
                        importOption={importOption}
                        addNotify={(message, type) => dispatch('addNotify', { message, type })}
                        updateFormAttack={params => dispatch('updateFormAttack', params)}
                        setFormAttack={params => dispatch('setFormAttack', params)}
                        updateFormImport={(params) => {
                          dispatch('updateModalImportOption', params);
                        }}
                        openImportModal={() => {
                          dispatch('updateModalImportOption', { isModalActive: true });
                        }}
                        closeImportModal={() => {
                          dispatch('updateModalImportOption', { isModalActive: false });
                        }}
                      />
                    )}
                  />
                  <Route
                    path="/results/:filename" render={({ match }) => (
                      <PageResult
                        filename={match.params.filename}
                        report={reports.get(match.params.filename)}
                        onMount={this.handlePageResultMount}
                        onShowResultList={filename => dispatch('showResultList', filename)}
                      />
                    )}
                  />
                </div>
                {/* End of column */}
              </div>
              {/* End of columns */}
            </div>
            {/* End of container */}
          </section>
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
