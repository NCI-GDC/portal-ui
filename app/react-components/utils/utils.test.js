import { toSingle } from './aaNotationer';

test('converts amino acids to single letter notation', () => {
  expect(toSingle('p.SER3373TER')).toBe('S3373*');
  expect(toSingle('p.Ser3373TER')).toBe('S3373*');
  expect(toSingle('p.Ser2826LysfsTer2')).toBe('S2826Kfs*2');
  expect(toSingle('p.Arg548ThrfsTer16')).toBe('R548Tfs*16');
});
