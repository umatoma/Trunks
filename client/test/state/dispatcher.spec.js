import { expect } from 'chai';
import sinon from 'sinon';
import Dispatcher from '../../state/dispatcher';

describe('Dispatcher', () => {
  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });

  describe('#dispatch()', () => {
    it('should enqueue an action and update state', () => {
      const setStateSpy = sandbox.spy();
      const getState = () => {};
      const actions = { dummyAction: () => ({ state: 'newValue' }) };
      const dispatcher = new Dispatcher(setStateSpy, getState, actions);
      const actionSpy = sandbox.spy(actions, 'dummyAction');

      dispatcher.dispatch('dummyAction', 'dummyParams');
      expect(actionSpy.calledOnce).to.be.true;
      expect(actionSpy.firstCall.args).to.deep.equal([getState, 'dummyParams']);
      expect(setStateSpy.calledOnce).to.be.true;
      expect(setStateSpy.firstCall.args[0]).to.deep.equal({ state: 'newValue' });
    });
  });

  describe('#update()', () => {
    it('should call stacked action queue and update state', () => {
      const setStateSpy = sandbox.spy();
      const getState = () => {};
      const actions = { dummyAction: () => ({ state: 'newValue' }) };
      const actionSpy = sandbox.spy(actions, 'dummyAction');

      const dispatcher = new Dispatcher(setStateSpy, getState, actions);
      dispatcher.updateQueue.push({
        fn: actions.dummyAction,
        actionName: 'dummyAction',
        params: 'dummyParams',
      });

      dispatcher.update();
      expect(actionSpy.calledOnce).to.be.true;
      expect(actionSpy.firstCall.args).to.deep.equal([getState, 'dummyParams']);
      expect(setStateSpy.calledOnce).to.be.true;
      expect(setStateSpy.firstCall.args[0]).to.deep.equal({ state: 'newValue' });
    });

    it('should not call stacked action if other action is processing', () => {
      const setStateSpy = sandbox.spy();
      const getState = () => {};
      const actions = { dummyAction: () => ({ state: 'newValue' }) };
      const actionSpy = sandbox.spy(actions, 'dummyAction');

      const dispatcher = new Dispatcher(setStateSpy, getState, actions);
      dispatcher.isUpdating = true;
      dispatcher.updateQueue.push({
        fn: actions.dummyAction,
        actionName: 'dummyAction',
        params: 'dummyParams',
      });
      expect(dispatcher.updateQueue).not.to.be.empty;

      dispatcher.update();
      expect(actionSpy.notCalled).to.be.true;
      expect(setStateSpy.notCalled).to.be.true;
    });

    it('should pass dispatch method if return value of action is a function', () => {
      const setState = () => {};
      const getState = () => {};
      const asyncFuncSpy = sandbox.spy();
      const actions = { dummyAction: () => asyncFuncSpy };
      const actionSpy = sandbox.spy(actions, 'dummyAction');

      const dispatcher = new Dispatcher(setState, getState, actions);
      dispatcher.updateQueue.push({
        fn: actions.dummyAction,
        actionName: 'dummyAction',
        params: 'dummyParams',
      });

      dispatcher.update();
      expect(actionSpy.calledOnce).to.be.true;
      expect(actionSpy.firstCall.args).to.deep.equal([getState, 'dummyParams']);
      expect(asyncFuncSpy.calledOnce).to.be.true;
      expect(asyncFuncSpy.firstCall.args).to.deep.equal([dispatcher.dispatch]);
    });
  });
});
