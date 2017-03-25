import EventEmitter from 'eventemitter3';

/**
 * @class
 * @classdesc Dispatcher dispatch parameters to action and update state.
 */
class Dispatcher {
  /**
   * @constructor
   * @param {Function} setState - Component.setState
   * @param {Function} getState - Component.getState
   * @param {{ [eventName]: {Function} }} actions - pairs of eventName and listener
   */
  constructor(setState, getState, actions) {
    const wrapListener = listener => (params) => {
      const newState = listener(this.getState, params);
      this.setState(newState);
    };
    const emitter = new EventEmitter();
    Object.keys(actions).forEach((eventName) => {
      emitter.on(eventName, wrapListener(actions[eventName]));
    });

    this.setState = setState;
    this.getState = getState;
    this.emitter = emitter;
    this.dispatch = this.dispatch.bind(this);
  }

  /**
   * dispatch parameters to action and update state
   * @param {String} eventName
   * @param {Any} params
   */
  dispatch(eventName, params) {
    this.emitter.emit(eventName, params);
  }
}

export default Dispatcher;
