import React from 'react';
import { OrderedSet } from 'immutable';
import Header from './Header';
import FromPostAttack from './FormPostAttack';
import Notifications from './Notifications';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      notifications: OrderedSet(),
    };
    this.addNotify = this.addNotify.bind(this);
    this.handleCloseNotify = this.handleCloseNotify.bind(this);
  }

  addNotify(message, type = 'primary') {
    this.setState({
      notifications: this.state.notifications.add({ key: Date.now(), message, type }),
    });
  }

  handleCloseNotify(key) {
    this.setState({
      notifications: this.state.notifications.filter(n => n.key !== key),
    });
  }

  render() {
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
                <FromPostAttack addNotify={this.addNotify} />
              </div>
            </div>
          </section>
        </div>
        <Notifications
          notifications={this.state.notifications.toArray()}
          onClose={this.handleCloseNotify}
        />
      </div>
    );
  }
}

export default App;
