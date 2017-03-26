import AppState from './app-state';
import AttackState from './attack-state';

export const getInitialState = state => Object.assign({ // eslint-disable-line
  appState: new AppState(),
  attackState: new AttackState(),
}, state);
