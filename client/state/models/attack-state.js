import { Record, List, Map } from 'immutable';

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

const ModelFormImport = new Record({
  isModalActive: false,
  error: null,
  text: '',
});

const AttackStateRecord = new Record({
  isImportModalActive: false,
  worker: new ModelWorker(),
  metrics: new ModelMetrics(),
  resultFiles: List(),
  reports: Map(),
  formAttack: new ModelFormAttack(),
  formImport: new ModelFormImport(),
});

export default class AttackState extends AttackStateRecord {
  /**
   * set import modal active status
   * @param {Boolean} isActive
   * @return {AttackState}
   */
  setImportModalActive(isActive) {
    return this.set('isImportModalActive', isActive);
  }

  /**
   * update importOption
   * @param {Object} params
   * @return {AttackState}
   */
  updateFormImport(params) {
    return this.set('formImport', this.formImport.merge(params));
  }

  /**
   * set resultFiles
   * @param {Array.<{Object}>}
   * @return {AttackState}
   */
  setResultFiles(files) {
    return this.set('resultFiles', List(files));
  }

  /**
   * set state to attack started
   * @param {Object} workerParams
   * @return {AttackState}
   */
  startAttack(workerParams) {
    return this.merge({
      worker: new ModelWorker(Object.assign({ status: 'active', filename: '' }, workerParams)),
      metrics: new ModelMetrics(),
    });
  }

  /**
   * set state to attack finished
   * @param {String} filename
   * @return {AttackState}
   */
  finishAttack(filename) {
    return this.set('worker', this.worker.merge({ status: 'done', filename }));
  }

  /**
   * set state to attack canceled
   * @return {AttackState}
   */
  cancelAttack() {
    return this.set('worker', this.worker.set('status', 'canceled'));
  }

  /**
   * set state to attack failed
   * @param {Error} error
   * @return {AttackState}
   */
  failAttack(error) {
    return this.set('worker', this.worker.merge({ status: 'error', error }));
  }

  /**
   * update metrics and set worker status to active
   * @param {Object} metricsParams
   * @return {AttackState}
   */
  updateAttackMetrics(metricsParams) {
    return this.merge({
      worker: this.worker.set('status', 'active'),
      metrics: new ModelMetrics(metricsParams),
    });
  }

  /**
   * initialize the report data in the list
   * @param {String} filename
   * @return {AttackState}
   */
  initReportData(filename) {
    return this.set('reports', this.reports.set(filename, new ModelReport()));
  }

  /**
   * set report data in the list
   * @param {String} filename
   * @param {Object} metrics
   * @param {Array} results
   * @param {Array} histgram
   * @return {AttackState}
   */
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

  /**
   * set error in the list
   * @param {String} filename
   * @param {Error} error
   * @return {AttackState}
   */
  setReportDataError(filename, error) {
    const reports = this.reports.update(filename, (d) => { // eslint-disable-line
      return d.merge({ isFetching: false, error });
    });
    return this.set('reports', reports);
  }

  /**
   * set report state to showing results
   * @param {String} filename
   * @return {AttackState}
   */
  showResultList(filename) {
    const reports = this.reports.update(filename, (d) => { // eslint-disable-line
      return d.set('showResultList', true);
    });
    return this.set('reports', reports);
  }

  /**
   * update formAttack
   * @param {Object} params
   * @return {AttackState}
   */
  updateFormAttack(params) {
    return this.set('formAttack', this.formAttack.merge(params));
  }

  /**
   * set formAttack
   * @param {Object}
   * @return {AttackState}
   */
  setFormAttack(params) {
    return this.set('formAttack', new ModelFormAttack(params));
  }
}
