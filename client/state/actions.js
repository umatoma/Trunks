/**
 * actions for appState
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

/**
 * actions for attackState
 */
export function updateModalImportOption({ attackState }, params) {
  return {
    attackState: attackState.updateModalImportOption(params),
  };
}

export function setResultFiles({ attackState }, files) {
  return {
    attackState: attackState.setResultFiles(files),
  };
}

export function startAttack({ attackState }, workerParams) {
  return {
    attackState: attackState.startAttack(workerParams),
  };
}

export function finishAttack({ attackState }, filename) {
  return {
    attackState: attackState.finishAttack(filename),
  };
}

export function cancelAttack({ attackState }) {
  return {
    attackState: attackState.cancelAttack(),
  };
}

export function failAttack({ attackState }, error) {
  return {
    attackState: attackState.failAttack(error),
  };
}

export function updateAttackMetrics({ attackState }, metricsParams) {
  return {
    attackState: attackState.updateAttackMetrics(metricsParams),
  };
}

export function initReportData({ attackState }, filename) {
  return {
    attackState: attackState.initReportData(filename),
  };
}

export function setReportData({ attackState }, { filename, metrics, results, histgram }) {
  return {
    attackState: attackState.setReportData(filename, metrics, results, histgram),
  };
}

export function setReportDataError({ attackState }, { filename, error }) {
  return {
    attackState: attackState.setReportDataError(filename, error),
  };
}

export function showResultList({ attackState }, filename) {
  return {
    attackState: attackState.showResultList(filename),
  };
}

export function updateFormAttack({ attackState }, params) {
  return {
    attackState: attackState.updateFormAttack(params),
  };
}

export function setFormAttack({ attackState }, params) {
  return {
    attackState: attackState.setFormAttack(params),
  };
}
