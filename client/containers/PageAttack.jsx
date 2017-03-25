import React from 'react';
import { Link } from 'react-router-dom';
import FromPostAttack from '../components/FormPostAttack';
import WorkerProgress from '../components/WorkerProgress';
import Metrics from '../components/Metrics';
import ModalImportOption from '../components/ModalImportOption';
import { convertToObject } from '../lib/option';

const isActive = worker => worker.status === 'active';
const isDone = worker => worker.status === 'done';
const isNotReady = worker => worker.status !== 'ready';

const Attack = ({
  worker,
  metrics,
  formAttack,
  importOption,
  dispatch,
}) => (
  <div>
    <div className="content">
      <div className="message">
        <div className="message-body">
          <span className="icon">
            <i className="fa fa-lightbulb-o" />
          </span>
          <span>
            Refer to <a href="https://github.com/tsenart/vegeta" target="_blank" rel="noopener noreferrer">vegeta</a> for explanation of each option.
          </span>
        </div>
      </div>
      <div className="field is-grouped" style={{ marginBottom: '1rem' }}>
        <p className="control">
          <button
            className="button is-small"
            onClick={() => dispatch('updateModalImportOption', { isModalActive: true })}
          >
            <span className="icon is-small">
              <i className="fa fa-upload" />
            </span>
            <span>Import options</span>
          </button>
        </p>
      </div>
      <FromPostAttack
        form={formAttack}
        addNotify={(message, type) => dispatch('addNotify', { message, type })}
        onUpdate={params => dispatch('updateFormAttack', params)}
        isAttacking={worker.status === 'active'}
      />
    </div>
    <div className="content">
      {isNotReady(worker, metrics) ? <Metrics metrics={metrics} /> : null}
      {isActive(worker) ? <WorkerProgress worker={worker} metrics={metrics} /> : null}
      {isDone(worker) ? (
        <Link className="button is-primary is-outlined is-fullwidth" to={`/results/${worker.filename}`}>
          Check details
        </Link>
      ) : null}
    </div>
    <ModalImportOption
      isActive={importOption.isModalActive}
      form={{ text: importOption.text, error: importOption.error }}
      onChange={params => dispatch('updateModalImportOption', params)}
      onClose={() => dispatch('updateModalImportOption', { isModalActive: true })}
      onSubmit={({ text }) => {
        try {
          dispatch('setFormAttack', convertToObject(text));
          dispatch('updateModalImportOption', { isModalActive: false });
          dispatch('addNotify', { message: 'Importing option was successful.' });
        } catch (e) {
          dispatch('updateModalImportOption', { error: e });
        }
      }}
    />
  </div>
);

Attack.propTypes = {
  worker: React.PropTypes.object.isRequired,
  metrics: React.PropTypes.object.isRequired,
  formAttack: React.PropTypes.object.isRequired,
  importOption: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
};

export default Attack;
