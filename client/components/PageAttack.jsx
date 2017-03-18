import React from 'react';
import FromPostAttack from './FormPostAttack';
import Metrics from './Metrics';

const Attack = ({ worker, metrics, addNotify }) => (
  <div>
    <section className="section">
      <FromPostAttack addNotify={addNotify} isAttacking={worker.status === 'active'} />
    </section>
    <section className="section">
      <Metrics worker={worker} metrics={metrics} />
    </section>
  </div>
);

Attack.propTypes = {
  worker: React.PropTypes.object.isRequired,
  metrics: React.PropTypes.object.isRequired,
  addNotify: React.PropTypes.func.isRequired,
};

export default Attack;
