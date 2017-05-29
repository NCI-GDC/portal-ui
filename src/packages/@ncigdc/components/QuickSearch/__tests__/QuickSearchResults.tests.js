 /* @flow */
import { findMatchingToken } from '../QuickSearchResults';

describe('findMatchingToken', () => {
  const item = JSON.parse('{"cytoband":["2p23.3"],"external_db_ids":{"entrez_gene":["9540"],"hgnc":["HGNC:19373"],"omim_gene":["605171"],"uniprotkb_swissprot":["Q53FA7"]},"gene_id":"ENSG00000115129","id":"R2VuZTpFTlNHMDAwMDAxMTUxMjk=","name":"tumor protein p53 inducible protein 3","symbol":"TP53I3","synonyms":["PIG3"],"transcripts":{"hits":{"edges":[{"node":{"transcript_id":"ENST00000335934","translation_id":"ENSP00000337834"}},{"node":{"transcript_id":"ENST00000238721","translation_id":"ENSP00000238721"}},{"node":{"transcript_id":"ENST00000407482","translation_id":"ENSP00000384414"}},{"node":{"transcript_id":"ENST00000417886","translation_id":null}},{"node":{"transcript_id":"ENST00000413037","translation_id":"ENSP00000389620"}},{"node":{"transcript_id":"ENST00000470636","translation_id":null}}]}}}');
  it('should find single word in item object', () => {
    const value = 'tumor protein p53 inducible protein 3';
    expect(findMatchingToken(item, 'tumor')).toEqual(value);
  });
  it('should find multiple words in item object', () => {
    const value = 'tumor protein p53 inducible protein 3';
    expect(findMatchingToken(item, 'tumor protein')).toEqual(value);
  });
});
