import React from 'react';
import { OrderedSet } from 'immutable';
import Notifications from './Notifications';
import { postAttack } from '../lib/api-client';

class FormPostAttack extends React.Component {
  constructor() {
    super();
    this.state = {
      form: {
        Targets: '',
        Duration: '5s',
        Rate: 1,
      },
      notifications: OrderedSet(),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeTargets = this.handleChangeTargets.bind(this);
    this.handleCloseNotify = this.handleCloseNotify.bind(this);
  }

  addNotification(message) {
    this.setState({
      notifications: this.state.notifications.add({ key: Date.now(), message }),
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    postAttack(this.state.form)
      .then(() => this.addNotification('succeeded to post form'))
      .catch(err => console.error(err));
  }

  handleChangeTargets(e) {
    this.setState({
      form: Object.assign({}, this.state.form, { Targets: e.target.value }),
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
        <form onSubmit={this.handleSubmit}>
          <p className="control">
            <textarea
              className="textarea"
              placeholder="targets"
              value={this.state.Targets}
              onChange={this.handleChangeTargets}
            />
          </p>
          <p className="control">
            <button className="button is-primary" type="submit">Submit</button>
          </p>
        </form>
        <Notifications
          notifications={this.state.notifications.toArray()}
          onClose={this.handleCloseNotify}
        />
      </div>
    );
  }
}

export default FormPostAttack;
