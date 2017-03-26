import * as apiClient from '../lib/api-client';

/**
 * actions for appState
 */
export function addNotify(getState, { message, type = 'info' }) {
  return {
    appState: getState().appState.addNotify(message, type),
  };
}

export function removeNotify(getState, notification) {
  return {
    appState: getState().appState.removeNotify(notification),
  };
}

export function toggleHeaderHamburger(getState) {
  return {
    appState: getState().appState.toggleHeaderHamburger(),
  };
}

export function toggleSideMenuModal(getState) {
  return {
    appState: getState().appState.toggleSideMenuModal(),
  };
}

/**
 * actions for attackState
 */
export function updateModalImportOption(getState, params) {
  return {
    attackState: getState().attackState.updateModalImportOption(params),
  };
}

export function setResultFiles(getState, files) {
  return {
    attackState: getState().attackState.setResultFiles(files),
  };
}

export function startAttack(getState, workerParams) {
  return {
    attackState: getState().attackState.startAttack(workerParams),
  };
}

export function finishAttack(getState, filename) {
  return {
    attackState: getState().attackState.finishAttack(filename),
  };
}

export function cancelAttack(getState) {
  return {
    attackState: getState().attackState.cancelAttack(),
  };
}

export function failAttack(getState, error) {
  return {
    attackState: getState().attackState.failAttack(error),
  };
}

export function updateAttackMetrics(getState, metricsParams) {
  return {
    attackState: getState().attackState.updateAttackMetrics(metricsParams),
  };
}

export function initReportData(getState, filename) {
  return {
    attackState: getState().attackState.initReportData(filename),
  };
}

export function setReportData(getState, { filename, metrics, results, histgram }) {
  return {
    attackState: getState().attackState.setReportData(filename, metrics, results, histgram),
  };
}

export function setReportDataError(getState, { filename, error }) {
  return {
    attackState: getState().attackState.setReportDataError(filename, error),
  };
}

export function showResultList(getState, filename) {
  return {
    attackState: getState().attackState.showResultList(filename),
  };
}

export function updateFormAttack(getState, params) {
  return {
    attackState: getState().attackState.updateFormAttack(params),
  };
}

export function setFormAttack(getState, params) {
  return {
    attackState: getState().attackState.setFormAttack(params),
  };
}

/**
 * async actions
 */
export function startAttackAsync(getState, params) {
  return apiClient.startAttack(params)
    .then(() => addNotify(getState, { message: 'succeeded to post attack' }))
    .catch(() => addNotify(getState, { message: 'failed to post attack', type: 'danger' }));
}

export function cancelAttackAsync(getState) {
  return apiClient.cancelAttack()
    .then(() => addNotify(getState, { message: 'succeeded to cancel attack' }))
    .catch(() => addNotify(getState, { message: 'failed to cancel attack', type: 'danger' }));
}

export function fetchResultFilesAsync(getState) {
  return apiClient.getResultFiles()
    .then(files => setResultFiles(getState, files))
    .catch(() => addNotify(getState, { message: 'failed to fetch result files', type: 'danger' }));
}

export function fetchReportAsync(getState, filename) {
  return apiClient.getReport(filename)
    .then(report => setReportData(getState, Object.assign({ filename }, report)))
    .catch(error => setReportDataError(getState, { filename, error }));
}
