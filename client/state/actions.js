import { List } from 'immutable';
import {
  ModelWorker,
  ModelMetrics,
  ModelReport,
  ModelFormAttack,
} from './models';

export function addNotify(getState, { message, type = 'info' }) {
  const { notifications } = getState();
  return {
    notifications: notifications.add({ key: Date.now(), message, type }),
  };
}

export function removeNotify(getState, notification) {
  const { notifications } = getState();
  return {
    notifications: notifications.delete(notification),
  };
}

export function toggleHeaderHamburger(getState) {
  const { header } = getState();
  return {
    header: header.set('isHamburgerActive', !header.isHamburgerActive),
  };
}

export function toggleSideMenuModal(getState) {
  const { sideMenu } = getState();
  return {
    sideMenu: sideMenu.set('isModalActive', !sideMenu.isModalActive),
  };
}

export function updateModalImportOption(getState, params) {
  const { importOption } = getState();
  return {
    importOption: importOption.merge(params),
  };
}

export function setResultFiles(getState, files) {
  return { resultFiles: List(files) };
}

export function startAttack(getState, workerParams) {
  return {
    worker: new ModelWorker(Object.assign({ status: 'active', filename: '' }, workerParams)),
    metrics: new ModelMetrics(),
  };
}

export function finishAttack(getState, filename) {
  const { worker } = getState();
  return {
    worker: worker.merge({ status: 'done', filename }),
  };
}

export function cancelAttack(getState) {
  const { worker } = getState();
  return {
    worker: worker.set('status', 'canceled'),
  };
}

export function failAttack(getState, error) {
  const { worker } = getState();
  return {
    worker: worker.merge({ status: 'error', error }),
  };
}

export function updateAttackMetrics(getState, metricsParams) {
  const { worker } = getState();
  return {
    worker: worker.set('status', 'active'),
    metrics: new ModelMetrics(metricsParams),
  };
}

export function initReportData(getState, filename) {
  const { reports } = getState();
  return {
    reports: reports.set(filename, new ModelReport()),
  };
}

export function setReportData(getState, { filename, metrics, results, histgram }) {
  const { reports } = getState();
  return {
    reports: reports.update(filename, (d) => { // eslint-disable-line
      return d.merge({
        isFetching: false,
        metrics: new ModelMetrics(metrics),
        histgram: List(histgram),
        results: List(results),
      });
    }),
  };
}

export function setReportDataError(getState, { filename, error }) {
  const { reports } = getState();
  return {
    reports: reports.update(filename, (d) => { // eslint-disable-line
      return d.merge({ isFetching: false, error });
    }),
  };
}

export function showResultList(getState, filename) {
  const { reports } = getState();
  return {
    reports: reports.update(filename, (d) => { // eslint-disable-line
      return d.set('showResultList', true);
    }),
  };
}

export function updateFormAttack(getState, params) {
  const { formAttack } = getState();
  return {
    formAttack: formAttack.merge(params),
  };
}

export function setFormAttack(getState, params) {
  return {
    formAttack: new ModelFormAttack(params),
  };
}
