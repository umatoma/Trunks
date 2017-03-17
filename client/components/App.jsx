import React from 'react';
import { OrderedSet, Record } from 'immutable';
import Header from './Header';
import FromPostAttack from './FormPostAttack';
import Metrics from './Metrics';
import Notifications from './Notifications';

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
    };

    this.addNotify = this.addNotify.bind(this);
    this.handleDissmissNotify = this.handleDissmissNotify.bind(this);
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
    const { worker, metrics } = this.state;
    return (
      <div>
        <Header />
        <div className="container">
          <section className="hero">
            <div className="hero-body">
              <div className="container">
                <h1 className="title">
                  Trunks
                </h1>
                <h2 className="subtitle">
                  Trunks is a simple HTTP load testing tool with UI
                </h2>
              </div>
            </div>
          </section>
          <section className="section">
            <FromPostAttack addNotify={this.addNotify} isAttacking={worker.get('is_active')} />
          </section>
          <section className="section">
            <Metrics worker={worker} metrics={metrics} />
          </section>
        </div>
        <Notifications
          notifications={this.state.notifications.toArray()}
          onDissmiss={this.handleDissmissNotify}
        />
      </div>
    );
  }
}

export default App;
