/* @flow */

import { mapStringArrayToTsvString } from '../toTsvString';

describe('mapStringArrayToTsvString', () => {
  it('should return a tsv string', () => {
    const header = ['h1', 'h2'];
    const row1 = ['d1', 'd2'];
    const data = [row1, row1];
    const expected = 'h1\th2\nd1\td2\nd1\td2';
    const output = mapStringArrayToTsvString(header, data);
    expect(output).toEqual(expected);
  });

  it('should collapse empty columns', () => {
    const header = [
      'h1',
      'h2',
      '',
    ];
    const row1 = [
      'd1',
      'd2',
      '',
    ];
    const data = [row1, row1];
    const expected = 'h1\th2\nd1\td2\nd1\td2';
    const output = mapStringArrayToTsvString(header, data);
    expect(output).toEqual(expected);
  });

  it('should not collapse partially empty columns', () => {
    const header = [
      'h1',
      'h2',
      'h3',
    ];
    const row1 = [
      'd1',
      'd2',
      '',
    ];
    const data = [row1, row1];
    const expected = 'h1\th2\th3\nd1\td2\t\nd1\td2\t';
    const output = mapStringArrayToTsvString(header, data);
    expect(output).toEqual(expected);
  });

  it('should keep empty cells', () => {
    const header = [
      'h1',
      'h2',
      'h3',
    ];
    const row1 = [
      'd1',
      '',
      'd3',
    ];
    const row2 = [
      'd1',
      'd2',
      'd3',
    ];
    const row3 = [
      '',
      '',
      'd3',
    ];
    const data = [
      row1,
      row2,
      row3,
    ];
    const expected = 'h1\th2\th3\nd1\t\td3\nd1\td2\td3\n\t\td3';
    const output = mapStringArrayToTsvString(header, data);
    expect(output).toEqual(expected);
  });
});
