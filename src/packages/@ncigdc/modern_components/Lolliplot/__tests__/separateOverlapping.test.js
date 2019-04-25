/* @flow */

import separateOverlapping, { overlaps } from '../separateOverlapping';

const p1 = {
  start: 1,
  end: 10,
};

const p2 = {
  start: 5,
  end: 15,
};

const p3 = {
  start: 12,
  end: 15,
};

const p4 = {
  start: 12,
  end: 16,
};

const p5 = {
  start: 13,
  end: 14,
};

const p6 = {
  start: 14,
  end: 15,
};

const tests = [
  {
    message: 'basic split',
    data: [p1, p2],
    expected: [[p1], [p2]],
  },
  {
    message: 'should not split always',
    data: [p1, p3],
    expected: [[p1, p3]],
  },
  {
    message: 'should split correctly',
    data: [
      p1,
      p2,
      p3,
      p4,
      p5,
      p6,
    ],
    expected: [
      [p1, p3],
      [p2],
      [p4],
      [p5, p6],
    ],
  },
];

describe('split overlapping ranges', () => {
  it('should compare properly', () => {
    expect(overlaps(p1, p2)).toBe(true);
    expect(overlaps(p1, p3)).toBe(false);
    expect(overlaps(p3, p4)).toBe(true);
    expect(overlaps(p4, p5)).toBe(true);
    expect(overlaps(p5, p6)).toBe(false);
  });

  tests.forEach(t => {
    it(t.message, () => {
      const result = separateOverlapping(t.data);

      expect(result).toHaveLength(t.expected.length);

      if (result.length !== t.expected.length) return;

      result.forEach((a, i) => {
        expect(a).toHaveLength(t.expected[i].length);
        a.forEach((b, j) => {
          expect(b).toEqual(t.expected[i][j]);
        });
      });
    });
  });
});
