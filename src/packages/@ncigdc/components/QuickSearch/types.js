// @flow

export type TShard = {
  failed: number,
  successful: number,
  total: number,
};

export type TSearchHitType =
  | 'gene'
  | 'case'
  | 'ssm'
  | 'occurrence'
  | 'project'
  | 'file'
  | 'annotation'
  | 'report';

export type TSearchHit = {
  _id: string,
  _score: number,
  _type: TSearchHitType,
};

export type TSearchResponse = {
  data: {
    _shards: TShard,
    hits: TSearchHit[],
    total: Number,
    timed_out: boolean,
    took: number,
  },
  warings: {},
};
