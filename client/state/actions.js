import { List } from 'immutable';
import {
  ModelWorker,
  ModelMetrics,
  ModelReport,
  ModelFormAttack,
} from './models';

/**
 * appState actions
 */
export function addNotify({ appState }, { message, type = 'info' }) {
  return {
    appState: appState.addNotify(message, type),
  };
}

export function removeNotify({ appState }, notification) {
  return {
    appState: appState.removeNotify(notification),
  };
}

export function toggleHeaderHamburger({ appState }) {
  return {
    appState: appState.toggleHeaderHamburger(),
  };
}

export function toggleSideMenuModal({ appState }) {
  return {
    appState: appState.toggleSideMenuModal(),
  };
}
/* ------------------------------ */

export function updateModalImportOption(state, params) {
  const { importOption } = state;
  return {
    importOption: importOption.merge(params),
  };
}

export function setResultFiles(state, files) {
  return { resultFiles: List(files) };
}

export function startAttack(state, workerParams) {
  return {
    worker: new ModelWorker(Object.assign({ status: 'active', filename: '' }, workerParams)),
    metrics: new ModelMetrics(),
  };
}

export function finishAttack(state, filename) {
  const { worker } = state;
  return {
    worker: worker.merge({ status: 'done', filename }),
  };
}

export function cancelAttack(state) {
  const { worker } = state;
  return {
    worker: worker.set('status', 'canceled'),
  };
}

export function failAttack(state, error) {
  const { worker } = state;
  return {
    worker: worker.merge({ status: 'error', error }),
  };
}

export function updateAttackMetrics(state, metricsParams) {
  const { worker } = state;
  return {
    worker: worker.set('status', 'active'),
    metrics: new ModelMetrics(metricsParams),
  };
}

export function initReportData(state, filename) {
  const { reports } = state;
  return {
    reports: reports.set(filename, new ModelReport()),
  };
}

export function setReportData(state, { filename, metrics, results, histgram }) {
  const { reports } = state;
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

export function setReportDataError(state, { filename, error }) {
  const { reports } = state;
  return {
    reports: reports.update(filename, (d) => { // eslint-disable-line
      return d.merge({ isFetching: false, error });
    }),
  };
}

export function showResultList(state, filename) {
  const { reports } = state;
  return {
    reports: reports.update(filename, (d) => { // eslint-disable-line
      return d.set('showResultList', true);
    }),
  };
}

export function updateFormAttack(state, params) {
  const { formAttack } = state;
  return {
    formAttack: formAttack.merge(params),
  };
}

export function setFormAttack(state, params) {
  return {
    formAttack: new ModelFormAttack(params),
  };
}
