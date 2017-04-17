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
export function openImportModal(getState) {
  return {
    attackState: getState().attackState.setImportModalActive(true),
  };
}

export function closeImportModal(getState) {
  return {
    attackState: getState().attackState.setImportModalActive(false),
  };
}

export function updateFormImport(getState, params) {
  return {
    attackState: getState().attackState.updateFormImport(params),
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
  return dispatch => apiClient.startAttack(params)
    .then(() => {
      dispatch('updateFormAttack', { error: null });
      dispatch('addNotify', { message: 'succeeded to post attack' });
    })
    .catch(error => dispatch('updateFormAttack', { error }));
}

export function cancelAttackAsync() {
  return dispatch => apiClient.cancelAttack()
    .then(() => dispatch('addNotify', { message: 'succeeded to cancel attack' }))
    .catch(() => dispatch('addNotify', { message: 'failed to cancel attack', type: 'danger' }));
}

export function fetchResultFilesAsync() {
  return dispatch => apiClient.getResultFiles()
    .then(files => dispatch('setResultFiles', files))
    .catch(() => dispatch('addNotify', { message: 'failed to fetch result files', type: 'danger' }));
}

export function fetchReportAsync(getState, filename) {
  return dispatch => apiClient.getReport(filename)
    .then(report => dispatch('setReportData', Object.assign({ filename }, report)))
    .catch(error => dispatch('setReportDataError', { filename, error }));
}
