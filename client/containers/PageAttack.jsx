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
  isImportModalActive,
  worker,
  metrics,
  formAttack,
  formImport,
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
            onClick={() => dispatch('openImportModal')}
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
        isAttacking={worker.status === 'active'}
        onUpdate={params => dispatch('updateFormAttack', params)}
        onSubmit={params => dispatch('startAttackAsync', params)}
        onCancel={() => dispatch('cancelAttackAsync')}
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
      isActive={isImportModalActive}
      form={formImport}
      onChange={params => dispatch('updateFormImport', params)}
      onClose={() => dispatch('closeImportModal')}
      onSubmit={({ text }) => {
        try {
          dispatch('setFormAttack', convertToObject(text));
          dispatch('closeImportModal');
          dispatch('addNotify', { message: 'Importing option was successful.' });
        } catch (e) {
          dispatch('updateFormImport', { error: e });
        }
      }}
    />
  </div>
);

Attack.propTypes = {
  isImportModalActive: React.PropTypes.bool.isRequired,
  worker: React.PropTypes.object.isRequired,
  metrics: React.PropTypes.object.isRequired,
  formAttack: React.PropTypes.object.isRequired,
  formImport: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
};

export default Attack;
