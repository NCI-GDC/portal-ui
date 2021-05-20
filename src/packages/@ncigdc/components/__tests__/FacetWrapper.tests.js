import { getFacetType } from '@ncigdc/components/FacetWrapper';

describe('getFacetType', () => {
  describe('returns "range"', () => {
    it('for long types', () => {
      expect(getFacetType({ type: 'long' })).toBe('range');
    });

    it('for float types', () => {
      expect(getFacetType({ type: 'float' })).toBe('range');
    });

    it('for double types', () => {
      expect(getFacetType({ type: 'double' })).toBe('range');
    });
  });
});
