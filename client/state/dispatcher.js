import EventEmitter from 'eventemitter3';
import { List } from 'immutable';
import {
  ModelWorker,
  ModelMetrics,
  ModelReport,
  ModelFormAttack,
} from './models';

class Dispatcher {
  constructor(setState, getState, actions) {
    this.setState = setState;
    this.getState = getState;
    // bind method context
    // FIXME: It's lame to bind all methods, so please fix it.
    // this.addNotify = this.addNotify.bind(this);
    this.toggleHeaderHamburger = this.toggleHeaderHamburger.bind(this);
    this.toggleSideMenuModal = this.toggleSideMenuModal.bind(this);
    this.updateModalImportOption = this.updateModalImportOption.bind(this);
    this.setResultFiles = this.setResultFiles.bind(this);
    this.startAttack = this.startAttack.bind(this);
    this.finishAttack = this.finishAttack.bind(this);
    this.updateAttackMetrics = this.updateAttackMetrics.bind(this);
    this.initReportData = this.initReportData.bind(this);
    this.setReportData = this.setReportData.bind(this);
    this.setReportDataError = this.setReportDataError.bind(this);
    this.showResultList = this.showResultList.bind(this);
    this.updateFormAttack = this.updateFormAttack.bind(this);
    this.setFormAttack = this.setFormAttack.bind(this);

    const wrapListener = listener => (params) => {
      const newState = listener(this.getState, params);
      this.setState(newState);
    };
    const emitter = new EventEmitter();
    Object.keys(actions).forEach((eventName) => {
      emitter.on(eventName, wrapListener(actions[eventName]));
    });
    this.emitter = emitter;
    this.dispatch = this.dispatch.bind(this);
  }

  dispatch(eventName, params) {
    this.emitter.emit(eventName, params);
  }

  toggleHeaderHamburger() {
    const { header } = this.getState();
    this.setState({
      header: header.set('isHamburgerActive', !header.isHamburgerActive),
    });
  }

  toggleSideMenuModal() {
    const { sideMenu } = this.getState();
    this.setState({
      sideMenu: sideMenu.set('isModalActive', !sideMenu.isModalActive),
    });
  }

  updateModalImportOption(params) {
    const { importOption } = this.getState();
    this.setState({ importOption: importOption.merge(params) });
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
      worker: worker.merge({ status: 'done', filename }),
    });
  }

  cancelAttack() {
    const { worker } = this.getState();
    this.setState({
      worker: worker.set('status', 'canceled'),
    });
  }

  failAttack(error) {
    const { worker } = this.getState();
    this.setState({
      worker: worker.merge({ status: 'error', error }),
    });
  }

  updateAttackMetrics(metricsParams) {
    const { worker } = this.getState();
    this.setState({
      worker: worker.set('status', 'active'),
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
        return d.merge({
          isFetching: false,
          metrics: new ModelMetrics(metrics),
          histgram: List(histgram),
          results: List(results),
        });
      }),
    });
  }

  setReportDataError(filename, error) {
    const { reports } = this.getState();
    this.setState({
      reports: reports.update(filename, (d) => { // eslint-disable-line
        return d.merge({ isFetching: false, error });
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

  setFormAttack(params) {
    this.setState({
      formAttack: new ModelFormAttack(params),
    });
  }
}

export default Dispatcher;