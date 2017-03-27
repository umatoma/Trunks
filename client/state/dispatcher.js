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
    this.isUpdating = false;
    this.updateQueue = [];
    this.setState = setState;
    this.getState = getState;
    this.actions = actions;
    this.middlewares = middlewares;
    this.dispatch = this.dispatch.bind(this);
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
    this.updateQueue.push({ fn: this.actions[eventName], eventName, params });
    this.update();
  }

  /**
   * update state if queue is stacked
   */
  update() {
    if (this.isUpdating === true || this.updateQueue.length === 0) {
      return;
    }

    this.isUpdating = true;
    const { fn, eventName, params } = this.updateQueue.shift();
    const stateOrFunc = fn(this.getState, params);

    if (typeof stateOrFunc === 'function') {
      this.isUpdating = false;
      stateOrFunc(this.dispatch);
      return;
    }

    const newState = this.applyMiddlewares(stateOrFunc, eventName);
    this.setState(newState, () => {
      this.isUpdating = false;
      this.update();
    });
  }
}

export default Dispatcher;
