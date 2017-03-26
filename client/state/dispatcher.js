import EventEmitter from 'eventemitter3';

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

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
      emitter.on(eventName, this.wrapListener(actions[eventName], eventName));
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
   * @param {String} eventName
   * @return {Function}
   */
  wrapListener(listener, eventName) {
    return (params) => {
      const ret = listener(this.getState, params);
      (isPromise(ret) ? ret : Promise.resolve(ret)).then((state) => {
        const newState = this.applyMiddlewares(state, eventName);
        this.setState(newState);
      }).catch((err) => {
        console.error(eventName, err); // eslint-disable-line no-console
      });
    };
  }

  /**
   * apply middlewares to state
   * @param {Object} newState
   * @param {String} eventName
   * @param {Object}
   */
  applyMiddlewares(newState, eventName) {
    return this.middlewares.reduce(
      (state, middleware) => middleware(state, eventName),
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
