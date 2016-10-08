/* @flow */
/* eslint no-use-before-define: 0 */

export type TDataCategory = {|
  case_count?: number,
  data_category?: TCategory,
  file_count?: number,
|};

// waiting on $Values
export type TCategory =
  'Raw Sequencing Data'
  | 'Transcriptome Profiling'
  | 'Simple Nucleotide Variation'
  | 'Copy Number Variation'
  | 'Clinical'
  | 'Biospecimen';

export type TCategoryAbbr =
  'Seq'
  | 'Exp'
  | 'SNV'
  | 'CNV'
  | 'Clinical'
  | 'Bio';

export type TCategoryMap = { [k: TCategoryAbbr]: TCategory };
export const CATEGORY_MAP: TCategoryMap = {
  Seq: 'Raw Sequencing Data',
  Exp: 'Transcriptome Profiling',
  SNV: 'Simple Nucleotide Variation',
  CNV: 'Copy Number Variation',
  Clinical: 'Clinical',
  Bio: 'Biospecimen',
};

type TFindDataCategory = (category: TCategoryAbbr, categories: Array<TDataCategory>) => TDataCategory;
export const findDataCategory: TFindDataCategory = (category, categories) => (
  categories.find(x => x.data_category === CATEGORY_MAP[category]) || { data_category: CATEGORY_MAP[category], file_count: 0, case_count: 0 }
);
