import { omitBy, some } from 'lodash';

type TFacet =
  | Record<string, ICategoricalFacet>
  | Record<string, IContinuousFacet>;

interface IContinuousFacet {
  stats: {
    count: number | null;
    max: number | null;
    min: number | null;
    avg: number | null;
    sum: number | null;
  };
  count?: number;
}

interface ICategoricalFacet {
  buckets: [{ key: string; doc_count: number }];
}

export default (facets: TFacet) =>
  omitBy(
    facets,
    aggregation =>
      !(aggregation as ICategoricalFacet) ||
      some([
        (aggregation as ICategoricalFacet).buckets &&
          (aggregation as ICategoricalFacet).buckets.filter(
            (bucket: { key: string; doc_count: number }) =>
              bucket.key !== '_missing'
          ).length === 0,
        (aggregation as IContinuousFacet).count === 0,
        (aggregation as IContinuousFacet).count === null,
        (aggregation as IContinuousFacet).stats &&
          (aggregation as IContinuousFacet).stats.count === 0,
      ])
  );
