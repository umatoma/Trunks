import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { OrderedSet, Record, List } from 'immutable';
import Header from './Header';
import Footer from './Footer';
import TitleBanner from './TitleBanner';
import SideMenu from './SideMenu';
import Notifications from './Notifications';
import Attack from './Attack';
import { getResultFiles } from '../lib/api-client';

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

class App extends React.Component {
  constructor() {
    super();

    // create websocket connection
    const conn = new WebSocket(`ws://${document.location.host}/ws`);
    conn.onclose = () => this.handleCloseWebSocket();
    conn.onmessage = evt => this.handleWebSocketMessage(evt);

    this.state = {
      webSocketConn: conn,
      notifications: OrderedSet(),
      worker: new Worker(),
      metrics: new MetricsModel(),
      resultFiles: List(),
    };

    this.addNotify = this.addNotify.bind(this);
    this.handleDissmissNotify = this.handleDissmissNotify.bind(this);
  }

  componentDidMount() {
    this.fetchResultFile();
  }

  fetchResultFile() {
    return getResultFiles()
      .then((files) => { this.setState({ resultFiles: List(files) }); })
      .catch(() => { this.addNotify('failed to fetch result files'); });
  }

  handleCloseWebSocket() {
    this.addNotify('WebSocket connection closed');
  }

  handleWebSocketMessage(evt) {
    const { event, data } = JSON.parse(evt.data);
    switch (event) {
      case 'attackStart':
        this.setState({
          worker: new Worker(Object.assign({ status: 'active', filename: '' }, data)),
          metrics: new MetricsModel(),
        });
        break;
      case 'attackFinish':
        this.setState({
          worker: this.state.worker.set('status', 'done').set('filename', data.filename),
        });
        this.fetchResultFile();
        break;
      case 'attackMetrics':
        this.setState({
          metrics: new MetricsModel(data),
        });
        break;
      default:
        break;
    }
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

  render() {
    const { worker, metrics, resultFiles } = this.state;
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
              <div className="column is-9">
                <Attack worker={worker} metrics={metrics} addNotify={this.addNotify} />
              </div>
            </div>
          </div>
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
