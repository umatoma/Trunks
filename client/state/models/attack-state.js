import { Record, List, Map } from 'immutable';

const ModelImportOption = new Record({
  isModalActive: false,
  error: null,
  text: '',
});

const ModelWorker = new Record({
  status: 'ready',
  error: null,
  duration: 0,
  rate: 0,
  filename: '',
});

const ModelMetrics = new Record({
  bytes_in: { total: 0, mean: 0 },
  bytes_out: { total: 0, mean: 0 },
  duration: 0,
  earliest: '',
  end: '',
  errors: null,
  latencies: { mean: 0, max: 0, '50th': 0, '95th': 0, '99th': 0 },
  latest: {},
  rate: 0,
  requests: 0,
  status_codes: {},
  success: 0,
  wait: 0,
});

const ModelReport = Record({
  isFetching: true,
  showResultList: false,
  error: null,
  metrics: new ModelMetrics(),
  histgram: List(),
  results: List(),
});

const ModelFormAttack = Record({
  Body: '',
  Duration: '10s',
  Rate: 1,
  Targets: '',
});

const AttackStateRecord = new Record({
  importOption: new ModelImportOption(),
  worker: new ModelWorker(),
  metrics: new ModelMetrics(),
  resultFiles: List(),
  reports: Map(),
  formAttack: new ModelFormAttack(),
});

export default class AttackState extends AttackStateRecord {
  updateModalImportOption(params) {
    return this.set('importOption', this.importOption.merge(params));
  }

  setResultFiles(files) {
    return this.set('resultFiles', List(files));
  }

  startAttack(workerParams) {
    return this.merge({
      worker: new ModelWorker(Object.assign({ status: 'active', filename: '' }, workerParams)),
      metrics: new ModelMetrics(),
    });
  }

  finishAttack(filename) {
    return this.set('worker', this.worker.merge({ status: 'done', filename }));
  }

  cancelAttack() {
    return this.set('worker', this.worker.set('status', 'canceled'));
  }

  failAttack(error) {
    return this.set('worker', this.worker.merge({ status: 'error', error }));
  }

  updateAttackMetrics(metricsParams) {
    return this.merge({
      worker: this.worker.set('status', 'active'),
      metrics: new ModelMetrics(metricsParams),
    });
  }

  initReportData(filename) {
    return this.set('reports', this.reports.set(filename, new ModelReport()));
  }

  setReportData(filename, metrics, results, histgram) {
    const reports = this.reports.update(filename, (d) => { // eslint-disable-line
      return d.merge({
        isFetching: false,
        metrics: new ModelMetrics(metrics),
        histgram: List(histgram),
        results: List(results),
      });
    });
    return this.set('reports', reports);
  }

  setReportDataError(filename, error) {
    const reports = this.reports.update(filename, (d) => { // eslint-disable-line
      return d.merge({ isFetching: false, error });
    });
    return this.set('reports', reports);
  }

  showResultList(filename) {
    const reports = this.reports.update(filename, (d) => { // eslint-disable-line
      return d.set('showResultList', true);
    });
    return this.set('reports', reports);
  }

  updateFormAttack(params) {
    return this.set('formAttack', this.formAttack.merge(params));
  }

  setFormAttack(params) {
    return this.set('formAttack', new ModelFormAttack(params));
  }
}
