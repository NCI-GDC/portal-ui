/* @flow */
/* eslint no-use-before-define: 0 */

export type TDataCategory = {
  case_count?: number,
  data_category: TCategory,
  file_count?: number,
};

// waiting on $Values
export type TCategory =
  | 'Raw Sequencing Data'
  | 'Transcriptome Profiling'
  | 'Simple Nucleotide Variation'
  | 'Copy Number Variation'
  | 'Clinical'
  | 'DNA Methylation'
  | 'Biospecimen';

export type TCategoryAbbr =
  | 'Seq'
  | 'Exp'
  | 'SNV'
  | 'CNV'
  | 'Clinical'
  | 'Bio'
  | 'Meth';

export type TCategoryMap = { [k: TCategoryAbbr]: TCategory };

export type TFindDataCategory = (
  category: TCategoryAbbr,
  categories: Array<TDataCategory>,
) => TDataCategory;
export type TSumDataCategories = (categories: Array<TDataCategory>) => number;
