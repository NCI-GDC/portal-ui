/* @flow */

import { processBAMSliceInput } from '../BAMModal';

jest.mock('@ncigdc/utils/download', () => {});

describe('processBAMSliceInput', () => {
  it('should process BED format', () => {
    expect(processBAMSliceInput('chr1')).toEqual({ regions: ['chr1'] });
    expect(processBAMSliceInput('chr1\t1')).toEqual({ regions: ['chr1:1'] });
    expect(processBAMSliceInput('chr1\t1\t2')).toEqual({
      regions: ['chr1:1-2'],
    });
    expect(processBAMSliceInput('chr1\t1\t2')).toEqual({
      regions: ['chr1:1-2'],
    });
    expect(processBAMSliceInput('chr1\t1\t2\nchr2')).toEqual({
      regions: ['chr1:1-2', 'chr2'],
    });
    expect(processBAMSliceInput('chr1\t1\t2\nchr2\nchr3:1')).toEqual({
      regions: [
        'chr1:1-2',
        'chr2',
        'chr3:1',
      ],
    });
  });
  it('should process colon dash format', () => {
    expect(processBAMSliceInput('chr1:1')).toEqual({ regions: ['chr1:1'] });
    expect(processBAMSliceInput('chr1:1-2')).toEqual({ regions: ['chr1:1-2'] });
    expect(processBAMSliceInput('chr1:1-2\nchr2:3-4')).toEqual({
      regions: ['chr1:1-2', 'chr2:3-4'],
    });
  });
  it('should process mixed BED and colon dash format', () => {
    expect(processBAMSliceInput('chr1:1-2\nchr2\t3\t4')).toEqual({
      regions: ['chr1:1-2', 'chr2:3-4'],
    });
  });
});
