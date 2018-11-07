/* @flow */
import _ from 'lodash';
import { DATA_CATEGORIES } from '@ncigdc/utils/constants';

import {
  TCategoryMap,
  TFindDataCategory,
  TSumDataCategories,
  TCategoryAbbr,
} from './types';

export const CATEGORY_MAP: TCategoryMap = _.fromPairs(
  Object.values(DATA_CATEGORIES).map(c => [c.abbr, c.full]),
);

export const findDataCategory: TFindDataCategory = (category, categories) =>
  categories.find(x => x.data_category === CATEGORY_MAP[category]) || {
    data_category: CATEGORY_MAP[category],
    file_count: 0,
    case_count: 0,
  };

export const sumDataCategories: TSumDataCategories = categories =>
  Object.keys(CATEGORY_MAP).reduce(
    (acc, key: TCategoryAbbr) =>
      acc + findDataCategory(key, categories).file_count,
    0,
  );

type TBuildProteinLolliplotArgs = {
  transcript: {
    domains: Array<Object>,
    transcript_id: string,
  },
  data: Array<Object>,
};
export const buildProteinLolliplotData = (
  {
    transcript = {
      domains: [],
      transcript_id: '',
    },
    data = [],
  }: TBuildProteinLolliplotArgs = {},
) => ({
  mutations: data
    .filter(x => {
      const co = x.consequence.find(
        c => c.transcript.transcript_id === transcript.transcript_id,
      );
      return co && co.transcript.aa_start;
    })
    .map(mutation => {
      // need to filter here on client unless filtered on server
      const consequence = mutation.consequence.find(
        c => c.transcript.transcript_id === transcript.transcript_id,
      );

      return {
        id: mutation.ssm_id,
        y: mutation.score,
        genomic_dna_change: mutation.genomic_dna_change,
        x: consequence.transcript.aa_start,
        consequence: consequence.transcript.consequence_type.replace(
          '_variant',
          '',
        ),
        impact: (consequence.transcript.annotation || {}).impact || 'UNKNOWN',
        aa_change: consequence.transcript.aa_change,
      };
    }),

  proteins: (transcript.domains || []).map(protein => ({
    id: protein.hit_name,
    start: protein.start,
    end: protein.end,
    description: protein.description,
  })),
});
