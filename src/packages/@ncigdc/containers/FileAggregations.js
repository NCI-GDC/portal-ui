/* @flow */
/* eslint jsx-a11y/no-static-element-interactions: 0, max-len: 1 */

import React from 'react';
import Relay from 'react-relay/classic';

import _ from 'lodash';
import { compose, withState } from 'recompose';

import Modal from '@ncigdc/uikit/Modal';
import SuggestionFacet from '@ncigdc/components/Aggregations/SuggestionFacet';
import FacetSelection from '@ncigdc/components/FacetSelection';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';

import {
  initialFileAggregationsVariables,
  repositoryFileAggregationsFragment,
} from '@ncigdc/utils/generated-relay-query-parts';
import withFacetSelection from '@ncigdc/utils/withFacetSelection';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';

import type { TBucket } from '@ncigdc/components/Aggregations/types';

import { withTheme } from '@ncigdc/theme';
import FileIcon from '@ncigdc/theme/icons/File';
import { Row } from '@ncigdc/uikit/Flex';

const storageKey = 'RepositoryFileAggregations.userSelectedFacets';

const presetFacets = [
  { title: 'File', field: 'file_id', full: 'files.file_id', type: 'keyword' },
  { field: 'data_category', full: 'files.data_category', type: 'keyword' },
  { field: 'data_type', full: 'files.data_type', type: 'keyword' },
  {
    field: 'experimental_strategy',
    full: 'files.experimental_strategy',
    type: 'keyword',
  },
  {
    title: 'Workflow Type',
    field: 'analysis.workflow_type',
    full: 'files.analysis.workflow_type',
    type: 'keyword',
  },
  { field: 'data_format', full: 'files.data_format', type: 'keyword' },
  { field: 'platform', full: 'files.platform', type: 'keyword' },
  { field: 'access', full: 'files.access', type: 'keyword' },
];

const presetFacetFields = presetFacets.map(x => x.field);

const enhance = compose(
  withFacetSelection({
    storageKey,
    presetFacetFields,
    validFacetDocTypes: ['files'],
  }),
  withState('fileIdCollapsed', 'setFileIdCollapsed', false),
);

const styles = {
  link: {
    textDecoration: 'underline',
    color: '#2a72a5',
  },
};

export type TProps = {
  relay: Object,
  fileIdCollapsed: boolean,
  setFileIdCollapsed: Function,
  aggregations: {
    access: { buckets: [TBucket] },
    data_category: { buckets: [TBucket] },
    data_format: { buckets: [TBucket] },
    data_type: { buckets: [TBucket] },
    experimental_strategy: { buckets: [TBucket] },
    platform: { buckets: [TBucket] },
    analysis__workflow_type: { buckets: [TBucket] },
  },
  theme: Object,

  suggestions: Array<Object>,
  setAutocomplete: Function,

  userSelectedFacets: Array<{|
    description: String,
    doc_type: String,
    field: String,
    full: String,
    type: 'id' | 'string' | 'long',
  |}>,
  handleSelectFacet: Function,
  handleResetFacets: Function,
  presetFacetFields: Array<String>,
  shouldShowFacetSelection: Boolean,
  facetExclusionTest: Function,
};

export const FileAggregationsComponent = (props: TProps) =>
  <div>
    <div
      className="text-right"
      style={{
        padding: '10px 15px',
        borderBottom: `1px solid ${props.theme.greyScale5}`,
      }}
    >
      {!!props.userSelectedFacets.length &&
        <span>
          <a onClick={props.handleResetFacets} style={styles.link}>
            Reset
          </a>{' '}
          &nbsp;|&nbsp;
        </span>}
      <a
        onClick={() => props.setShouldShowFacetSelection(true)}
        style={styles.link}
      >
        Add a File Filter
      </a>

    </div>
    <Modal
      isOpen={props.shouldShowFacetSelection}
      style={{ content: { border: 0, padding: '15px' } }}
    >
      <FacetSelection
        title="Add a File Filter"
        onSelect={props.handleSelectFacet}
        onRequestClose={() => props.setShouldShowFacetSelection(false)}
        excludeFacetsBy={props.facetExclusionTest}
        additionalFacetData={props.aggregations}
        relay={props.relay}
      />
    </Modal>

    {props.userSelectedFacets.map(facet =>
      <FacetWrapper
        isRemovable
        key={facet.full}
        facet={facet}
        aggregation={props.aggregations[escapeForRelay(facet.field)]}
        relay={props.relay}
        onRequestRemove={() => props.handleRequestRemoveFacet(facet)}
        style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
      />,
    )}
    <FacetHeader
      title="File"
      field="files.file_id"
      collapsed={props.fileIdCollapsed}
      setCollapsed={props.setFileIdCollapsed}
      description="Enter File UUID or name"
    />
    <SuggestionFacet
      title="File"
      collapsed={props.fileIdCollapsed}
      doctype="files"
      fieldNoDoctype="file_id"
      placeholder="e.g. 142682.bam, 4f6e2e7a-b..."
      hits={props.suggestions}
      setAutocomplete={props.setAutocomplete}
      style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
      dropdownItem={x =>
        <Row>
          <FileIcon style={{ paddingRight: '1rem', paddingTop: '1rem' }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{x.file_id}</div>
            <div style={{ fontSize: '80%' }}>{x.submitter_id}</div>
            {x.file_name}
          </div>
        </Row>}
    />
    {_.reject(presetFacets, { full: 'files.file_id' }).map(facet =>
      <FacetWrapper
        key={facet.full}
        facet={facet}
        title={facet.title}
        aggregation={props.aggregations[escapeForRelay(facet.field)]}
        relay={props.relay}
        style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
        additionalProps={facet.additionalProps}
      />,
    )}

  </div>;

export const FileAggregationsQuery = {
  initialVariables: Object.assign(
    {},
    _.mapValues(initialFileAggregationsVariables, (value, key) => {
      const userSelectedFacetsFromStorage =
        tryParseJSON(window.localStorage.getItem(storageKey) || null) || [];
      const escapedFieldsToShow = presetFacetFields
        .concat(userSelectedFacetsFromStorage.map(x => x.field))
        .filter(Boolean)
        .map(escapeForRelay);
      return (
        value ||
        _.includes(escapedFieldsToShow, key.replace(/^shouldShow_/, ''))
      );
    }),
    { shouldRequestAllAggregations: false },
  ),
  prepareVariables: prevVariables =>
    _.mapValues(
      prevVariables,
      (value, key) =>
        prevVariables.shouldRequestAllAggregations ||
        initialFileAggregationsVariables[key] ||
        _.includes(
          (tryParseJSON(window.localStorage.getItem(storageKey)) || [])
            .map(x => escapeForRelay(x.field)),
          key.replace(/^shouldShow_/, ''),
        ) ||
        value,
    ),
  fragments: {
    aggregations: repositoryFileAggregationsFragment,
  },
};

const FileAggregations = Relay.createContainer(
  enhance(withTheme(FileAggregationsComponent)),
  FileAggregationsQuery,
);

export default FileAggregations;
