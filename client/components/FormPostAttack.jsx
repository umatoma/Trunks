import React from 'react';
import { postAttack } from '../lib/api-client';

class FormPostAttack extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.form !== this.props.form) {
      return true;
    }
    if (nextProps.isAttacking !== this.props.isAttacking) {
      return true;
    }
    return false;
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form } = this.props;
    const params = Object.assign({}, form.toJS(), {
      Rate: parseInt(form.Rate, 10) },
    );
    postAttack(params)
      .then(() => this.props.addNotify('succeeded to post attack'))
      .catch(() => this.props.addNotify('failed to post attack', 'danger'));
  }

  handleChangeTextField(key) {
    return (e) => {
      this.props.onUpdate(key, e.target.value);
    };
  }

  handleChangeTextArea(key) {
    return (e) => {
      this.props.onUpdate(key, e.target.value);
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
    const { form } = this.props;
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
                    value={form.Duration}
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
                    value={form.Rate}
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
                    value={form.Targets}
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
                    value={form.Body}
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
  form: React.PropTypes.object.isRequired,
  isAttacking: React.PropTypes.bool.isRequired,
  addNotify: React.PropTypes.func.isRequired,
  onUpdate: React.PropTypes.func.isRequired,
};

export default FormPostAttack;
