import React from 'react';

const sampleOption =
`# This form support to loading of options in TOML format.
Duration="10s"
Rate="1"
Targets="""
GET http://example.com/users
POST http://www.example.com/users
"""`;

const ModalImportOption = ({ isActive, form, onChange, onClose }) => (
  <div className={isActive ? 'tk-modal-import modal is-active' : 'tk-modal-import modal'}>
    <div className="modal-background" />
    <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">Import option</p>
        <button className="delete" onClick={onClose} />
      </header>
      <section className="modal-card-body">
        <pre>{sampleOption}</pre>
        <form>
          <div className="field">
            <p className="control">
              <textarea
                className="textarea"
                placeholder="Paste here..."
                value={form.text}
                onChange={e => onChange({ text: e.target.value })}
              />
            </p>
          </div>
        </form>
      </section>
      <footer className="modal-card-foot">
        <a className="button is-primary">Import</a>
        <a className="button" onClick={onClose}>Cancel</a>
      </footer>
    </div>
  </div>
);

ModalImportOption.propTypes = {
  isActive: React.PropTypes.bool.isRequired,
  form: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func.isRequired,
};

export default ModalImportOption;
