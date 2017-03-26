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
   * @param {Array.<{Function}>} middlewares - middleware functions [optional]
   */
  constructor(setState, getState, actions, middlewares = []) {
    const emitter = new EventEmitter();
    Object.keys(actions).forEach((eventName) => {
      emitter.on(eventName, this.wrapListener(actions[eventName]));
    });

    this.setState = setState;
    this.getState = getState;
    this.emitter = emitter;
    this.middlewares = middlewares;
    this.dispatch = this.dispatch.bind(this);
  }

  /**
   * wrap the listener so that it update state according to the return value.
   * @param {Function} listener
   * @return {Function}
   */
  wrapListener(listener) {
    return (params) => {
      const prevState = this.getState();
      const newState = this.applyMiddlewares(listener(prevState, params));
      this.setState(newState);
    };
  }

  /**
   * apply middlewares to state
   * @param {Object} newState
   * @param {Object}
   */
  applyMiddlewares(newState) {
    return this.middlewares.reduce(
      (state, middleware) => middleware(state),
      newState,
    );
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
