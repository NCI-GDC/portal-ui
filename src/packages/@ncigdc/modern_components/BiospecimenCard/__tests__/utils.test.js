/* @flow */

import { flatten } from 'lodash';
import { search, match } from '../utils';
import { testBiotree, testAliquot } from '../__fixtures__/biotree.fixture';

const getSubmitterIds = array =>
  array
    .map(o => (o.node || { submitter_id: '' }).submitter_id)
    .filter(x => x.length);
describe('match', () => {
  it('should match submitter ids', () => {
    const didMatch = match('TCGA-IR-A3LF-01A-21R-A22V-13', testAliquot);
    expect(didMatch).toBe(true);
  });

  it('should match uuids', () => {
    const didMatch = match('1e51fa8c-a6b4-48ec-b228-31fc6f3c77f9', testAliquot);
    expect(didMatch).toBe(true);
  });
});

describe('search', () => {
  it('should find top level partial matches', () => {
    const query = 'TC';
    const foundSubmitterIds = getSubmitterIds(
      flatten(testBiotree.map(e => search(query, e))),
    );
    expect(foundSubmitterIds).not.toHaveLength(0);
    foundSubmitterIds.forEach(id => expect(id).toMatch(query));
  });

  it('should find top level exact matches', () => {
    const query = 'TCGA-IR-A3LF-10A';
    const founds = flatten(testBiotree.map(e => search(query, e)));
    const foundSubmitterIds = getSubmitterIds(founds);
    expect(foundSubmitterIds).not.toHaveLength(0);
    foundSubmitterIds.forEach(id => expect(id).toMatch(query));
  });

  it('should find nested exact matches', () => {
    const query = 'TCGA-IR-A3LF-10A-01D-A22X-09';
    const founds = flatten(testBiotree.map(e => search(query, e)));
    const foundSubmitterIds = getSubmitterIds(founds);
    expect(foundSubmitterIds).not.toHaveLength(0);
    foundSubmitterIds.forEach(id => expect(id).toMatch(query));
  });

  it('should find on uuid', () => {
    const query = '1e51fa8c-a6b4-48ec-b228-31fc6f3c77f9';
    const founds = flatten(testBiotree.map(e => search(query, e)));
    expect(founds).not.toHaveLength(0);
  });
});
