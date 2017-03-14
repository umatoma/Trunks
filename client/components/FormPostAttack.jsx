import React from 'react';
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
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeTargets = this.handleChangeTargets.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    postAttack(this.state.form)
      .then(() => this.props.addNotify('succeeded to post attack'))
      .catch(() => this.props.addNotify('failed to post attack', 'danger'));
  }

  handleChangeTargets(e) {
    this.setState({
      form: Object.assign({}, this.state.form, { Targets: e.target.value }),
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
      </div>
    );
  }
}

FormPostAttack.propTypes = {
  addNotify: React.PropTypes.func.isRequired,
};

export default FormPostAttack;
