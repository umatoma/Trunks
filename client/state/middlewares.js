import debug from 'debug';

const debugState = debug('trunks:state');

const loggerMiddleware = (state) => {
  debugState(state);
  return state;
};

export function getMiddlewares() { // eslint-disable-line
  const middlewares = [];
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(loggerMiddleware);
  }
  return middlewares;
}
