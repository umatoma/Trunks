import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FormPostAttack from '../../components/FormPostAttack';

describe('<FormPostAttack />', () => {
  const props = {
    form: {},
    isAttacking: false,
    onUpdate: () => {},
    onSubmit: () => {},
    onCancel: () => {},
  };

  it('should contain a form', () => {
    const wrapper = shallow(<FormPostAttack {...props} />);
    expect(wrapper.find('form')).to.have.length(1);
  });
});
