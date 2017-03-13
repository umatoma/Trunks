import React from 'react';
import { postAttack } from '../lib/api-client';

class FormPostAttack extends React.Component {
  constructor() {
    super();
    this.state = {
      Targets: '',
      Duration: '5s',
      Rate: 1,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeTargets = this.handleChangeTargets.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    postAttack(this.state)
      .then(json => console.log(json))
      .catch(err => console.error(err));
  }

  handleChangeTargets(e) {
    this.setState({ Targets: e.target.value });
  }

  render() {
    return (
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
    );
  }
}

export default FormPostAttack;
