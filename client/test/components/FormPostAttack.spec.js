import React from 'react';
import { Record } from 'immutable';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import FormPostAttack from '../../components/FormPostAttack';

describe('<FormPostAttack />', () => {
  const Form = new Record({
    Duration: '10s',
    Rate: '5',
    Targets: 'http://localhost:3000',
    Body: '{ "key": "value" }',
  });
  const sandbox = sinon.sandbox.create();
  const props = {
    form: new Form(),
    isAttacking: false,
    onUpdate: () => {},
    onSubmit: () => {},
    onCancel: () => {},
  };

  afterEach(() => {
    sandbox.restore();
  });

  it('should contain a form', () => {
    const wrapper = shallow(<FormPostAttack {...props} />);
    expect(wrapper.find('form')).to.have.length(1);
  });

  it('should call onUpdate if input value will changed', () => {
    const onUpdateSpy = sinon.spy();
    const wrapper = shallow(<FormPostAttack {...props} onUpdate={onUpdateSpy} />);
    wrapper.find('input[name="Duration"]').simulate('change', {
      target: { value: '50s' },
    });
    wrapper.find('input[name="Rate"]').simulate('change', {
      target: { value: '30' },
    });
    wrapper.find('textarea[name="Targets"]').simulate('change', {
      target: { value: 'GET http://trunks.example.com' },
    });
    wrapper.find('textarea[name="Body"]').simulate('change', {
      target: { value: '{ "name": "Trunks" }' },
    });

    expect(onUpdateSpy.callCount).to.equal(4);
    expect(onUpdateSpy.getCall(0).args[0]).to.deep.equal({ Duration: '50s' });
    expect(onUpdateSpy.getCall(1).args[0]).to.deep.equal({ Rate: '30' });
    expect(onUpdateSpy.getCall(2).args[0]).to.deep.equal({ Targets: 'GET http://trunks.example.com' });
    expect(onUpdateSpy.getCall(3).args[0]).to.deep.equal({ Body: '{ "name": "Trunks" }' });
  });

  it('should call onSubmit if form will submitted', () => {
    const onSubmitSpy = sinon.spy();
    const wrapper = shallow(<FormPostAttack {...props} onSubmit={onSubmitSpy} />);
    wrapper.find('form').simulate('submit', { preventDefault: () => {} });

    expect(onSubmitSpy.callCount).to.equal(1);
    expect(onSubmitSpy.getCall(0).args[0]).to.deep.equal({
      Duration: '10s',
      Rate: 5,
      Targets: 'http://localhost:3000',
      Body: '{ "key": "value" }',
    });
  });

  it('should call onCancel if cancel button clicked', () => {
    const onCancelSpy = sinon.spy();
    const wrapper = shallow(<FormPostAttack {...props} onCancel={onCancelSpy} isAttacking />);
    wrapper.find('button[name="Cancel"]').simulate('click');

    expect(onCancelSpy.callCount).to.equal(1);
  });
});
