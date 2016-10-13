/* @flow */

import {
  prepareNodeParams,
 } from '..';

describe('prepareNodeParams', () => {
  it('should create a base64 id', () => {
    const obj = {
      id: btoa('File:hello'),
      offset: 0,
      filters: null,
    };
    expect(prepareNodeParams('File')({
      params: { id: 'hello' },
      location: { query: {} },
    })).toEqual(obj);
  });
});
