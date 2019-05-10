export interface IDataCategory {
  case_count?: number;
  data_category: TCategory;
  file_count?: number;
};

// waiting on $Values
export type TCategory =
  | 'Sequencing Reads'
  | 'Transcriptome Profiling'
  | 'Simple Nucleotide Variation'
  | 'Copy Number Variation'
  | 'Clinical'
  | 'DNA Methylation'
  | 'Biospecimen';

export type TCategoryAbbr =
  | 'Bio'
  | 'Clinical'
  | 'CNV'
  | 'Exp'
  | 'Meth'
  | 'Seq'
  | 'SNV';

export type TCategoryMap = { [k in TCategoryAbbr]: TCategory };

export type TFindDataCategory = (
  category: TCategoryAbbr,
  categories: IDataCategory[]
) => IDataCategory;
export type TSumDataCategories = (categories: IDataCategory[]) => number;
