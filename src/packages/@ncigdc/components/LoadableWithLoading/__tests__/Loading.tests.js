/* @flow */
import React from 'react';
import renderer from 'react-test-renderer';
import Loading from '../Loading';

describe('Loading', () => {
  it('handles isLoading before pastDelay', () => {
    const props = {
      isLoading: true,
      timedOut: false,
      pastDelay: false,
      error: false,
    };
    const component = renderer.create(<Loading {...props} />);
    expect(component).toMatchSnapshot(); // shows null
  });
  it('handles timedOut', () => {
    const props = {
      isLoading: true,
      timedOut: true,
      pastDelay: false,
      error: false,
    };
    const component = renderer.create(<Loading {...props} />);
    expect(component).toMatchSnapshot(); // shows timed out, note: currently timeout is not set, will keep waiting
  });
  it('handles pastDelay', () => {
    const props = {
      isLoading: true,
      timedOut: false,
      pastDelay: true,
      error: false,
    };
    const component = renderer.create(<Loading {...props} />);
    expect(component).toMatchSnapshot(); // shows spinner
  });
  it('handles error', () => {
    const props = {
      isLoading: false,
      timedOut: false,
      pastDelay: false,
      error: true,
    };
    const component = renderer.create(<Loading {...props} />);
    expect(component).toMatchSnapshot(); // shows error message
  });
});
