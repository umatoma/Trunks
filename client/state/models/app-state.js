import { Record, OrderedSet } from 'immutable';

const ModelHeader = new Record({
  isHamburgerActive: false,
});

const ModelSideMenu = new Record({
  isModalActive: false,
});

const AppStateRecord = new Record({
  notifications: OrderedSet(),
  header: new ModelHeader(),
  sideMenu: new ModelSideMenu(),
});

export default class AppState extends AppStateRecord {
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
