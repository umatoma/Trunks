import React from 'react';

class FormPostAttack extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickCancelButton = this.handleClickCancelButton.bind(this);
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
    const params = {};
    const obj = form.toJS();
    Object.keys(obj).forEach((k) => {
      const v = obj[k];
      if (v === '' || v === null || v === undefined) return;
      if (['Rate', 'Workers', 'Connections', 'Redirects'].includes(k)) {
        params[k] = parseInt(v, 10);
        return;
      }
      params[k] = v;
    });
    this.props.onSubmit(params);
  }

  handleClickCancelButton() {
    this.props.onCancel();
  }

  handleChangeTextField(key) {
    return (e) => {
      this.props.onUpdate({ [key]: e.target.value });
    };
  }

  handleChangeTextArea(key) {
    return (e) => {
      this.props.onUpdate({ [key]: e.target.value });
    };
  }

  handleChangeCheckbox(key) {
    return (e) => {
      this.props.onUpdate({ [key]: e.target.checked });
    };
  }

  renderSubmitOrCancelButton() {
    if (this.props.isAttacking) {
      return (
        <button
          name="Cancel"
          className="button is-danger is-fullwidth"
          type="button"
          onClick={this.handleClickCancelButton}
        >
          <span className="icon is-small">
            <i className="fa fa-stop" />
          </span>
          <span>Cancel attack</span>
        </button>
      );
    }
    return (
      <button className="button is-primary is-fullwidth" type="submit">
        <span className="icon is-small">
          <i className="fa fa-bolt" />
        </span>
        <span>Attack!!</span>
      </button>
    );
  }

  render() {
    const { form } = this.props;
    const checkboxs = [
      'HTTP2',
      'Insecure',
      'Lazy',
      'Keepalive',
    ];
    const textFields = [
      ['Duration', '10s'],
      ['Rate', '5'],
      ['Timeout', '30s'],
    ];
    const textareas = [
      ['Targets', 'GET https://127.0.0.1:8000/path/to/api?q=trunks'],
      ['Body', '{"key": "value"}'],
    ];
    return (
      <div className="form-post-attack">
        <form onSubmit={this.handleSubmit}>
          <div className="columns">
            <div className="column is-2">
              {checkboxs.map(key => (
                <div className="field" key={key}>
                  <p className="control">
                    <label className="label" htmlFor={key}>
                      <input
                        type="checkbox"
                        name={key}
                        checked={form[key]}
                        onChange={this.handleChangeCheckbox(key)}
                      />
                      &nbsp;{key}
                    </label>
                  </p>
                </div>
              ))}
            </div>
            {/* end of column */}
            <div className="column is-2">
              {textFields.map(([key, placeholder]) => (
                <div className="field" key={key}>
                  <label className="label" htmlFor={key}>{key}</label>
                  <p className="control">
                    <input
                      className="input"
                      type="text"
                      name={key}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={this.handleChangeTextField(key)}
                    />
                  </p>
                </div>
              ))}
            </div>
            {/* end of column */}
            <div className="column is-8">
              {textareas.map(([key, placeholder]) => (
                <div className="field" key={key}>
                  <label className="label" htmlFor={key}>{key}</label>
                  <p className="control">
                    <textarea
                      className="textarea"
                      name={key}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={this.handleChangeTextArea(key)}
                    />
                  </p>
                </div>
              ))}
            </div>
            {/* end of column */}
          </div>
          <div className="control">
            {form.error && (
              <article className="message is-danger">
                <div className="message-body">{form.error.message}</div>
              </article>
            )}
            {this.renderSubmitOrCancelButton()}
          </div>
        </form>
      </div>
    );
  }
}

FormPostAttack.propTypes = {
  form: React.PropTypes.object.isRequired,
  isAttacking: React.PropTypes.bool.isRequired,
  onUpdate: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
};

export default FormPostAttack;
