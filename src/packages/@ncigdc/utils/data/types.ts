export interface IDataCategory {
  case_count?: number;
  data_category: TCategory;
  file_count?: number;
}

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
  | 'Seq'
  | 'Exp'
  | 'SNV'
  | 'CNV'
  | 'Clinical'
  | 'Bio'
  | 'Meth';

export type TCategoryMap = { [k in TCategoryAbbr]: TCategory };

export type TFindDataCategory = (
  category: TCategoryAbbr,
  categories: IDataCategory[]
) => IDataCategory;
export type TSumDataCategories = (categories: IDataCategory[]) => number;
