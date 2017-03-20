import React from 'react';
import { Link } from 'react-router-dom';
import FromPostAttack from './FormPostAttack';
import WorkerProgress from './WorkerProgress';
import Metrics from './Metrics';

const isActive = worker => worker.status === 'active';
const isDone = worker => worker.status === 'done';
const isNotReady = worker => worker.status !== 'ready';

const Attack = ({ worker, metrics, formAttack, addNotify, updateFormAttack }) => (
  <div>
    <div className="content">
      <FromPostAttack
        form={formAttack}
        addNotify={addNotify}
        onUpdate={updateFormAttack}
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
  </div>
);

Attack.propTypes = {
  worker: React.PropTypes.object.isRequired,
  metrics: React.PropTypes.object.isRequired,
  formAttack: React.PropTypes.object.isRequired,
  addNotify: React.PropTypes.func.isRequired,
  updateFormAttack: React.PropTypes.func.isRequired,
};

export default Attack;
