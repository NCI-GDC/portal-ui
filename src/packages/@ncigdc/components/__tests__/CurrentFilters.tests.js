/* @flow */

import { getDisplayOp } from '@ncigdc/components/CurrentFilters';

describe('getDisplayOp', () => {
  it('should show IS for one value', () => {
    expect(getDisplayOp('in', ['lung'])).toEqual('IS');
  });
  it('should show IN for more than one value', () => {
    expect(getDisplayOp('in', ['lung', 'kidney'])).toEqual('IN');
  });
  it('should show IN for one value, if value has set_id', () => {
    expect(getDisplayOp('in', ['set_id:icecream123'])).toEqual('IN');
  });
  it('should directly show the op if anything else', () => {});
  expect(getDisplayOp('>=', ['0'])).toEqual('>=');
});
