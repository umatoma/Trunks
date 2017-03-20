import { OrderedSet, List, Map } from 'immutable';
import { ModelWorker, ModelMetrics, ModelReport, ModelFormAttack } from './models';

class Dispatcher {
  constructor(setState, getState) {
    this.setState = setState;
    this.getState = getState;
    // bind method context
    this.addNotify = this.addNotify.bind(this);
    this.removeNotify = this.removeNotify.bind(this);
    this.setResultFiles = this.setResultFiles.bind(this);
    this.startAttack = this.startAttack.bind(this);
    this.finishAttack = this.finishAttack.bind(this);
    this.setAttackMetrics = this.setAttackMetrics.bind(this);
    this.initReportData = this.initReportData.bind(this);
    this.setReportData = this.setReportData.bind(this);
    this.setReportDataError = this.setReportDataError.bind(this);
    this.showResultList = this.showResultList.bind(this);
    this.updateFormAttack = this.updateFormAttack.bind(this);
  }

  getInitialState(state) {
    return Object.assign({
      webSocketClient: null,
      notifications: OrderedSet(),
      worker: new ModelWorker(),
      metrics: new ModelMetrics(),
      resultFiles: List(),
      reports: Map(),
      formAttack: new ModelFormAttack(),
    }, state);
  }

  addNotify(message, type = 'primary') {
    const { notifications } = this.getState();
    this.setState({
      notifications: notifications.add({ key: Date.now(), message, type }),
    });
  }

  removeNotify(notification) {
    const { notifications } = this.getState();
    this.setState({
      notifications: notifications.delete(notification),
    });
  }

  setResultFiles(files) {
    this.setState({ resultFiles: List(files) });
  }

  startAttack(workerParams) {
    this.setState({
      worker: new ModelWorker(Object.assign({ status: 'active', filename: '' }, workerParams)),
      metrics: new ModelMetrics(),
    });
  }

  finishAttack(filename) {
    const { worker } = this.getState();
    this.setState({
      worker: worker.set('status', 'done').set('filename', filename),
    });
  }

  cancelAttack() {
    const { worker } = this.getState();
    this.setState({
      worker: worker.set('status', 'canceled'),
    });
  }

  failAttack(err) {
    const { worker } = this.getState();
    this.setState({
      worker: worker.set('status', 'error').set('error', err),
    });
  }

  setAttackMetrics(metricsParams) {
    this.setState({
      metrics: new ModelMetrics(metricsParams),
    });
  }

  initReportData(filename) {
    const { reports } = this.getState();
    this.setState({
      reports: reports.set(filename, new ModelReport()),
    });
  }

  setReportData(filename, { metrics, results, histgram }) {
    const { reports } = this.getState();
    this.setState({
      reports: reports.update(filename, (d) => { // eslint-disable-line
        return d.set('isFetching', false)
          .set('metrics', new ModelMetrics(metrics))
          .set('histgram', List(histgram))
          .set('results', List(results));
      }),
    });
  }

  setReportDataError(filename, error) {
    const { reports } = this.getState();
    this.setState({
      reports: reports.update(filename, (d) => { // eslint-disable-line
        return d.set('isFetching', false)
          .set('error', error);
      }),
    });
  }

  showResultList(filename) {
    const { reports } = this.getState();
    this.setState({
      reports: reports.update(filename, (d) => { // eslint-disable-line
        return d.set('showResultList', true);
      }),
    });
  }

  updateFormAttack(key, value) {
    const { formAttack } = this.getState();
    this.setState({
      formAttack: formAttack.set(key, value),
    });
  }
}

export default Dispatcher;
