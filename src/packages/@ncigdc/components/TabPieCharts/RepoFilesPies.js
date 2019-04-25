// @flow
import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import { compose, withState } from 'recompose';

import withSize from '@ncigdc/utils/withSize';
import { IBucket } from '@ncigdc/components/Aggregations/types';
import withRouter from '@ncigdc/utils/withRouter';
import { parseFilterParam } from '@ncigdc/utils/uri';
import {
  ColumnCenter,
  RowCenter,
  WrappedRow,
  ShowToggleBox,
  BottomBorderedBox,
  PieTitle,
  SelfFilteringPie,
} from '.';

export type TProps = {
  push: Function,
  query: Object,
  aggregations: {
    data_category: { buckets: [IBucket] },
    data_type: { buckets: [IBucket] },
    experimental_strategy: { buckets: [IBucket] },
    data_format: { buckets: [IBucket] },
    access: { buckets: [IBucket] },
  },
  setShowingMore: Function,
  showingMore: boolean,
  size: { width: number },
};

const enhance = compose(
  withRouter,
  withState('showingMore', 'setShowingMore', false),
  withSize(),
);

const RepoFilesPiesComponent = ({
  aggregations,
  query,
  push,
  showingMore,
  setShowingMore,
  size: { width },
}: TProps) => {
  const currentFilters =
    (query && parseFilterParam((query || {}).filters, {}).content) || [];
  const currentFieldNames = currentFilters.map(f => f.content.field);
  const pieColMinWidth = width / 5;
  return (
    <div className="test-repo-files-pies">
      <BottomBorderedBox>
        <WrappedRow style={{
          maxWidth: `${width}px`,
          width: '100%',
        }}>
          <ColumnCenter
            className="test-primary-site-pie"
            style={{ minWidth: `${pieColMinWidth}px` }}>
            <PieTitle>Primary Site</PieTitle>
            <SelfFilteringPie
              buckets={_.get(aggregations, 'cases__primary_site.buckets')}
              currentFieldNames={currentFieldNames}
              currentFilters={currentFilters}
              docTypeSingular="file"
              fieldName="files.cases.primary_site"
              height={125}
              path="doc_count"
              push={push}
              query={query}
              width={125} />
          </ColumnCenter>
          <ColumnCenter
            className="test-project-pie"
            style={{ minWidth: `${pieColMinWidth}px` }}>
            <PieTitle>Project</PieTitle>
            <SelfFilteringPie
              buckets={_.get(
                aggregations,
                'cases__project__project_id.buckets',
              )}
              currentFieldNames={currentFieldNames}
              currentFilters={currentFilters}
              docTypeSingular="file"
              fieldName="cases.project.project_id"
              height={125}
              path="doc_count"
              push={push}
              query={query}
              width={125} />
          </ColumnCenter>
          <ColumnCenter
            className="test-data-category-pie"
            style={{ minWidth: `${pieColMinWidth}px` }}>
            <PieTitle>Data Category</PieTitle>
            <SelfFilteringPie
              buckets={_.get(aggregations, 'data_category.buckets')}
              currentFieldNames={currentFieldNames}
              currentFilters={currentFilters}
              docTypeSingular="file"
              fieldName="files.data_category"
              height={125}
              path="doc_count"
              push={push}
              query={query}
              width={125} />
          </ColumnCenter>
          <ColumnCenter
            className="test-data-type"
            style={{ minWidth: `${pieColMinWidth}px` }}>
            <PieTitle>Data Type</PieTitle>
            <SelfFilteringPie
              buckets={_.get(aggregations, 'data_type.buckets')}
              currentFieldNames={currentFieldNames}
              currentFilters={currentFilters}
              docTypeSingular="file"
              fieldName="files.data_type"
              height={125}
              path="doc_count"
              push={push}
              query={query}
              width={125} />
          </ColumnCenter>
          <ColumnCenter
            className="test-data-format"
            style={{ minWidth: `${pieColMinWidth}px` }}>
            <PieTitle>Data Format</PieTitle>
            <SelfFilteringPie
              buckets={_.get(aggregations, 'data_format.buckets')}
              currentFieldNames={currentFieldNames}
              currentFilters={currentFilters}
              docTypeSingular="file"
              fieldName="files.data_format"
              height={125}
              path="doc_count"
              push={push}
              query={query}
              width={125} />
          </ColumnCenter>
          {showingMore && [
            <ColumnCenter
              className="test-experimental-strategy"
              key="files.experimental_strategy"
              style={{ minWidth: `${pieColMinWidth}px` }}>
              <PieTitle>Experimental Strategy</PieTitle>
              <SelfFilteringPie
                buckets={_.get(aggregations, 'experimental_strategy.buckets')}
                currentFieldNames={currentFieldNames}
                currentFilters={currentFilters}
                docTypeSingular="file"
                fieldName="files.experimental_strategy"
                height={125}
                path="doc_count"
                push={push}
                query={query}
                width={125} />
            </ColumnCenter>,
            <ColumnCenter
              className="test-access-level"
              key="files.access"
              style={{ minWidth: `${pieColMinWidth}px` }}>
              <PieTitle>Access Level</PieTitle>
              <SelfFilteringPie
                buckets={_.get(aggregations, 'access.buckets')}
                currentFieldNames={currentFieldNames}
                currentFilters={currentFilters}
                docTypeSingular="file"
                fieldName="files.access"
                height={125}
                path="doc_count"
                push={push}
                query={query}
                width={125} />
            </ColumnCenter>,
          ]}
        </WrappedRow>
      </BottomBorderedBox>
      <RowCenter style={{ marginTop: '-1.5rem' }}>
        <ShowToggleBox onClick={() => setShowingMore(!showingMore)}>
          Show
          {' '}
          {showingMore ? 'Less' : 'More'}
        </ShowToggleBox>
      </RowCenter>
    </div>
  );
};

export const RepoFilesPiesQuery = {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on FileAggregations {
        cases__project__project_id {
          buckets {
            doc_count
            key
          }
        }
        cases__primary_site {
          buckets {
            doc_count
            key
          }
        }
        data_category {
          buckets {
            doc_count
            key
          }
        }
        data_type {
          buckets {
            doc_count
            key
          }
        }
        experimental_strategy {
          buckets {
            doc_count
            key
          }
        }
        data_format {
          buckets {
            doc_count
            key
          }
        }
        access {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
};

const RepoFilesPies = Relay.createContainer(
  enhance(RepoFilesPiesComponent),
  RepoFilesPiesQuery,
);

export default RepoFilesPies;
