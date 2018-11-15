export interface IShard {
  failed: number;
  successful: number;
  total: number;
}

export type ISearchHitType =
  | 'gene'
  | 'case'
  | 'ssm'
  | 'occurrence'
  | 'project'
  | 'file'
  | 'annotation'
  | 'report';

export interface ISearchHit {
  _id: string;
  _score: number;
  _type: ISearchHitType;
}

export interface ISearchResponse {
  data: {
    _shards: IShard;
    hits: ISearchHit[];
    total: number;
    timed_out: boolean;
    took: number;
  };
  warings: {};
}
