/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';

import SearchPage from '@ncigdc/components/SearchPage';

import FileTable from '../FileTable';
import CaseTable from '../CaseTable';
import FileAggregations from '../FileAggregations';
import CaseAggregations from '../CaseAggregations';

export type TProps = {
  relay: Object,
  viewer: {
    cases: {
      aggregations: string,
      hits: string,
    },
    files: {
      aggregations: string,
      hits: string,
    },
  },
};

export const FilesPageComponent = (props: TProps) => {
  const setAutocomplete = quicksearch =>
    props.relay.setVariables({
      quicksearch,
      runQuicksearch: !!quicksearch,
    });

  return (
    <SearchPage
      data-test="legacy-files-page"
      facetTabs={[
        {
          text: 'cases',
          component: (
            <CaseAggregations
              aggregations={props.viewer.cases.aggregations}
              hits={(props.viewer.cases || {}).hits || {}}
              setAutocomplete={setAutocomplete}
            />
          ),
        },
        {
          text: 'files',
          component: (
            <FileAggregations aggregations={props.viewer.files.aggregations} />
          ),
        },
      ]}
      results={<FileTable hits={props.viewer.files.hits} />}
    />
  );
};

export const FilesPageQuery = {
  initialVariables: {
    files_offset: null,
    files_size: null,
    files_sort: null,
    filters: null,
    quicksearch: '',
    runQuicksearch: false,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        cases {
          aggregations(filters: $filters) {
            ${CaseAggregations.getFragment('aggregations')}
          }
          hits(first: 5, quicksearch: $quicksearch) @include(if: $runQuicksearch) {
            ${CaseTable.getFragment('hits')}
          }
        }
        files {
          aggregations(filters: $filters) {
            ${FileAggregations.getFragment('aggregations')}
          }
          hits(first: $files_size offset: $files_offset, sort: $files_sort filters: $filters) {
            ${FileTable.getFragment('hits')}
          }
        }
      }
    `,
  },
};

const FilesPage = Relay.createContainer(FilesPageComponent, FilesPageQuery);

export default FilesPage;
