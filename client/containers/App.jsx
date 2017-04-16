import React from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TitleBanner from '../components/TitleBanner';
import SideMenu from '../components/SideMenu';
import SideMenuForMobile from '../components/SideMenuForMobile';
import Notifications from '../components/Notifications';
import PageAttack from '../containers/PageAttack';
import PageResult from '../containers/PageResult';
import WebSocketClient from '../lib/websocket-client';
import Dispatcher from '../state/dispatcher';
import * as actions from '../state/actions';
import { getMiddlewares } from '../state/middlewares';
import { getInitialState } from '../state/models';

const SideMenuWithRouter = withRouter(SideMenu);
const SideMenuForMobileWithRouter = withRouter(SideMenuForMobile);

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
  }

  componentDidMount() {
    this.dispatch('fetchResultFilesAsync');
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

  handleCloseWebSocket() {
    this.dispatch('addNotify', { message: 'WebSocket connection closed' });
  }

  handleAttackStart(data) {
    this.dispatch('startAttack', data);
  }

  handleAttackFinish(data) {
    this.dispatch('finishAttack', data.filename);
    this.dispatch('fetchResultFilesAsync');
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

  render() {
    const { dispatch } = this;
    const { appState, attackState } = this.state;
    const { notifications, header, sideMenu } = appState;
    const {
      isImportModalActive,
      worker,
      metrics,
      resultFiles,
      reports,
      formAttack,
      formImport,
    } = attackState;

    return (
      <Router>
        <div>
          <div className="columns tk-main-columns">
            <div className="column is-2 is-hidden-mobile tk-side-menu-wrapper">
              <SideMenuWithRouter
                resultFiles={resultFiles}
                isModalActive={sideMenu.isModalActive}
                onToggleModal={() => dispatch('toggleSideMenuModal')}
              />
            </div>
            <div className="column is-10 tk-main-column">
              <Header
                isHamburgerActive={header.isHamburgerActive}
                onToggleHamburger={() => dispatch('toggleHeaderHamburger')}
              />
              <TitleBanner />
              <section className="section tk-section-main">
                <SideMenuForMobileWithRouter
                  resultFiles={resultFiles}
                  isModalActive={sideMenu.isModalActive}
                  onToggleModal={() => dispatch('toggleSideMenuModal')}
                />
                <Route
                  exact path="/" render={() => (
                    <PageAttack
                      isImportModalActive={isImportModalActive}
                      worker={worker}
                      metrics={metrics}
                      formAttack={formAttack}
                      formImport={formImport}
                      dispatch={this.dispatch}
                    />
                  )}
                />
                <Route
                  path="/results/:filename" render={({ match }) => (
                    <PageResult
                      filename={match.params.filename}
                      report={reports.get(match.params.filename)}
                      fetchReport={filename => dispatch('fetchReportAsync', filename)}
                      dispatch={this.dispatch}
                    />
                  )}
                />
              </section>
            </div>
          </div>
          <Footer />
          <Notifications
            notifications={notifications.toArray()}
            onDissmiss={this.handleDissmissNotify}
          />
        </div>
      </Router>
    );
  }
}

export default App;
