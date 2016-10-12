/* @flow */

import type {
  TCategoryMap,
  TFindDataCategory,
} from './types';

export const CATEGORY_MAP: TCategoryMap = {
  Seq: 'Raw Sequencing Data',
  Exp: 'Transcriptome Profiling',
  SNV: 'Simple Nucleotide Variation',
  CNV: 'Copy Number Variation',
  Clinical: 'Clinical',
  Bio: 'Biospecimen',
};

export const findDataCategory: TFindDataCategory = (category, categories) => (
  categories.find(
    x => x.data_category === CATEGORY_MAP[category]
  ) || { data_category: CATEGORY_MAP[category], file_count: 0, case_count: 0 }
);
