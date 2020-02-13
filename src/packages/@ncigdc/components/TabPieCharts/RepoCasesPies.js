// @flow
import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import { compose } from 'recompose';

import { IBucket } from '@ncigdc/components/Aggregations/types';
import withRouter from '@ncigdc/utils/withRouter';
import { parseFilterParam } from '@ncigdc/utils/uri';
import { ColumnCenter, RowCenter, PieTitle, SelfFilteringPie } from './';

export type TProps = {
  push: Function,
  query: Object,
  aggregations: {
    demographic__ethnicity: { buckets: [IBucket] },
    demographic__gender: { buckets: [IBucket] },
    demographic__race: { buckets: [IBucket] },
    demographic__vital_status: { buckets: [IBucket] },
    disease_type: { buckets: [IBucket] },
    primary_site: { buckets: [IBucket] },
    project__program__name: { buckets: [IBucket] },
    project__project_id: { buckets: [IBucket] },
  },
};

const enhance = compose(withRouter);

const RepoCasesPiesComponent = ({ aggregations, query, push }: TProps) => {
  const currentFilters =
    (query && parseFilterParam((query || {}).filters, {}).content) || [];
  const currentFieldNames = currentFilters.map(f => f.content.field);
  return (
    <RowCenter>
      <ColumnCenter className="test-primary-site">
        <PieTitle>Primary Site</PieTitle>
        <SelfFilteringPie
          buckets={_.get(aggregations, 'primary_site.buckets')}
          fieldName="cases.primary_site"
          docTypeSingular="case"
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          query={query}
          push={push}
          path="doc_count"
          diameter={125}
        />
      </ColumnCenter>
      <ColumnCenter className="test-project">
        <PieTitle>Project</PieTitle>
        <SelfFilteringPie
          buckets={_.get(aggregations, 'project__project_id.buckets')}
          fieldName="cases.project.project_id"
          docTypeSingular="case"
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          query={query}
          push={push}
          path="doc_count"
          diameter={125}
        />
      </ColumnCenter>
      <ColumnCenter className="test-disease-type">
        <PieTitle>Disease Type</PieTitle>
        <SelfFilteringPie
          buckets={_.get(aggregations, 'disease_type.buckets')}
          fieldName="cases.disease_type"
          docTypeSingular="case"
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          query={query}
          push={push}
          path="doc_count"
          diameter={125}
        />
      </ColumnCenter>
      <ColumnCenter className="test-gender">
        <PieTitle>Gender</PieTitle>
        <SelfFilteringPie
          buckets={_.get(aggregations, 'demographic__gender.buckets')}
          fieldName="cases.demographic.gender"
          docTypeSingular="case"
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          query={query}
          push={push}
          path="doc_count"
          diameter={125}
        />
      </ColumnCenter>
      <ColumnCenter className="test-vital-status">
        <PieTitle>Vital Status</PieTitle>
        <SelfFilteringPie
          buckets={_.get(aggregations, 'demographic__vital_status.buckets')}
          fieldName="cases.demographic.vital_status"
          docTypeSingular="case"
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          query={query}
          push={push}
          path="doc_count"
          diameter={125}
        />
      </ColumnCenter>
    </RowCenter>
  );
};

export const RepoCasesPiesQuery = {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on CaseAggregations {
        demographic__ethnicity {
          buckets {
            doc_count
            key
          }
        }
        demographic__gender {
          buckets {
            doc_count
            key
          }
        }
        demographic__race {
          buckets {
            doc_count
            key
          }
        }
        demographic__vital_status {
          buckets {
            doc_count
            key
          }
        }
        disease_type {
          buckets {
            doc_count
            key
          }
        }
        primary_site {
          buckets {
            doc_count
            key
          }
        }
        project__project_id {
          buckets {
            doc_count
            key
          }
        }
        project__program__name {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
};

const RepoCasesPies = Relay.createContainer(
  enhance(RepoCasesPiesComponent),
  RepoCasesPiesQuery,
);

export default RepoCasesPies;
