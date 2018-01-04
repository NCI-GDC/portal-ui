/* @flow */

import { capitalize, truncateAfterMarker, truncate } from '../string';
import { DNA_CHANGE_MARKERS } from '@ncigdc/utils/constants';

describe('capitalize', () => {
  it('should captalize a string', () => {
    expect(capitalize('danish marzipan biscuit')).toEqual(
      'Danish Marzipan Biscuit',
    );
  });

  it('should capitalize mirna as miRNA', () => {
    expect(capitalize('mirna')).toEqual('miRNA');
    expect(capitalize('danish marzipan mirna biscuit')).toEqual(
      'Danish Marzipan miRNA Biscuit',
    );
  });

  it('should capitalize dbsnp as dbSNP', () => {
    expect(capitalize('dbsnp')).toEqual('dbSNP');
    expect(capitalize('danish marzipan dbsnp biscuit')).toEqual(
      'Danish Marzipan dbSNP Biscuit',
    );
  });

  it('should capitalize cosmic as COSMIC', () => {
    expect(capitalize('cosmic')).toEqual('COSMIC');
    expect(capitalize('danish marzipan cosmic biscuit')).toEqual(
      'Danish Marzipan COSMIC Biscuit',
    );
  });
});

describe('truncateDNAChange', () => {
  it('return 8 characters after ins', () => {
    expect(
      truncateAfterMarker(
        'chr1:g.76576946_76576947insAAAAAAAAAAAAAAAAAAAAAAC',
        DNA_CHANGE_MARKERS,
        8,
      ),
    ).toEqual('chr1:g.76576946_76576947insAAAAAAAA…');
  });

  it('return 8 characters after del', () => {
    expect(
      truncateAfterMarker(
        'chr1:g.76576946_76576947delAAAAAAAAAAAAAAAAAAAAAAC',
        DNA_CHANGE_MARKERS,
        8,
      ),
    ).toEqual('chr1:g.76576946_76576947delAAAAAAAA…');
  });

  it('return 8 characters after >', () => {
    expect(
      truncateAfterMarker(
        'chr1:g.76576946_76576947A>AAAAAAAAAAAAAAAAAAAAAC',
        DNA_CHANGE_MARKERS,
        8,
      ),
    ).toEqual('chr1:g.76576946_76576947A>AAAAAAAA…');
  });
  it('doesnt add … if shorter than length', () => {
    expect(
      truncateAfterMarker('chr1:g.76576946_76576947A>C', DNA_CHANGE_MARKERS, 1),
    ).toEqual('chr1:g.76576946_76576947A>C');
  });
});
