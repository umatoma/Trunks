import React from 'react';
import { postAttack } from '../lib/api-client';

class FormPostAttack extends React.Component {
  constructor() {
    super();
    this.state = {
      form: {
        Body: '',
        Duration: '10s',
        Rate: 1,
        Targets: '',
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    postAttack(this.state.form)
      .then(() => this.props.addNotify('succeeded to post attack'))
      .catch(() => this.props.addNotify('failed to post attack', 'danger'));
  }

  handleChangeTextField(key) {
    return (e) => {
      this.setState({
        form: Object.assign({}, this.state.form, { [key]: e.target.value }),
      });
    };
  }

  handleChangeTextArea(key) {
    return (e) => {
      this.setState({
        form: Object.assign({}, this.state.form, { [key]: e.target.value }),
      });
    };
  }

  submitOrCancelButton() {
    if (this.props.isAttacking) {
      return (
        <button className="button is-danger is-fullwidth is-loading" type="button" />
      );
    }
    return (
      <button className="button is-primary is-fullwidth" type="submit">
        Attack!!
      </button>
    );
  }

  render() {
    return (
      <div className="form-post-attack">
        <form onSubmit={this.handleSubmit}>
          <div className="columns">
            <div className="column is-2">
              <div className="field">
                <label className="label" htmlFor="Duration">Duration</label>
                <p className="control">
                  <input
                    className="input"
                    type="text"
                    name="Duration"
                    placeholder="10s"
                    value={this.state.Duration}
                    onChange={this.handleChangeTextField('Duration')}
                  />
                </p>
              </div>
            </div>
            {/* end of column */}
            <div className="column is-2">
              <div className="field">
                <label className="label" htmlFor="Rate">Rate</label>
                <p className="control">
                  <input
                    className="input"
                    type="text"
                    name="Rate"
                    placeholder="1"
                    value={this.state.Rate}
                    onChange={this.handleChangeTextField('Rate')}
                  />
                </p>
              </div>
            </div>
            {/* end of column */}
            <div className="column is-8">
              <div className="field">
                <label className="label" htmlFor="Targets">Targets</label>
                <p className="control">
                  <textarea
                    className="textarea"
                    name="Targets"
                    placeholder="GET https://127.0.0.1:8000/path/to/api?q=trunks"
                    value={this.state.Targets}
                    onChange={this.handleChangeTextArea('Targets')}
                  />
                </p>
              </div>
              <div className="field">
                <label className="label" htmlFor="Body">Body</label>
                <p className="control">
                  <textarea
                    className="textarea"
                    name="Body"
                    placeholder="Requests body file"
                    value={this.state.Body}
                    onChange={this.handleChangeTextArea('Body')}
                  />
                </p>
              </div>
            </div>
            {/* end of column */}
          </div>
          <p className="control">
            {this.submitOrCancelButton()}
          </p>
        </form>
      </div>
    );
  }
}

FormPostAttack.propTypes = {
  isAttacking: React.PropTypes.bool.isRequired,
  addNotify: React.PropTypes.func.isRequired,
};

export default FormPostAttack;
