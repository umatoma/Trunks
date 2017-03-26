import { Record, List, OrderedSet, Map } from 'immutable';

export const ModelHeader = Record({
  isHamburgerActive: false,
});

export const ModelSideMenu = Record({
  isModalActive: false,
});

export const ModelImportOption = Record({
  isModalActive: false,
  error: null,
  text: '',
});

export const ModelWorker = Record({
  status: 'ready',
  error: null,
  duration: 0,
  rate: 0,
  filename: '',
});

export const ModelMetrics = Record({
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

export const ModelReport = Record({
  isFetching: true,
  showResultList: false,
  error: null,
  metrics: new ModelMetrics(),
  histgram: List(),
  results: List(),
});

export const ModelFormAttack = Record({
  Body: '',
  Duration: '10s',
  Rate: 1,
  Targets: '',
});

const AppStateRecord = new Record({
  notifications: OrderedSet(),
  header: new ModelHeader(),
  sideMenu: new ModelSideMenu(),
});

class AppState extends AppStateRecord {
  /**
   * add notification
   * @param {String} message
   * @param {String} type - e.g. 'info', 'danger', ...
   * @return {AppState}
   */
  addNotify(message, type) {
    const notifications = this.notifications.add({ key: Date.now(), message, type });
    return this.set('notifications', notifications);
  }

  /**
   * remove notification
   * @param {Object} notification
   * @return {AppState}
   */
  removeNotify(notification) {
    const notifications = this.notifications.delete(notification);
    return this.set('notifications', notifications);
  }

  /**
   * toggle active status of header hamburger menu
   * @return {AppState}
   */
  toggleHeaderHamburger() {
    const header = this.header.set('isHamburgerActive', !this.header.isHamburgerActive);
    return this.set('header', header);
  }

  /**
   * toggle active status of side menu modal
   * @return {AppState}
   */
  toggleSideMenuModal() {
    const sideMenu = this.sideMenu.set('isModalActive', !this.sideMenu.isModalActive);
    return this.set('sideMenu', sideMenu);
  }
}

export const getInitialState = state => Object.assign({
  appState: new AppState(),
  importOption: new ModelImportOption(),
  worker: new ModelWorker(),
  metrics: new ModelMetrics(),
  resultFiles: List(),
  reports: Map(),
  formAttack: new ModelFormAttack(),
}, state);
