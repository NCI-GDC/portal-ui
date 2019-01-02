/* @flow */
/* eslint jsx-a11y/no-static-element-interactions: 0, max-len: 1 */

import React from 'react';

import _ from 'lodash';
import {
  compose,
  withState,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';

import Modal from '@ncigdc/uikit/Modal';
import SuggestionFacet from '@ncigdc/modern_components/SuggestionFacet';
import FacetSelection from '@ncigdc/modern_components/FacetSelection';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';

import withFacetSelection from '@ncigdc/utils/withFacetSelection';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';

import { IBucket } from '@ncigdc/components/Aggregations/types';

import { withTheme } from '@ncigdc/theme';
import FileIcon from '@ncigdc/theme/icons/File';
import { Row } from '@ncigdc/uikit/Flex';

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
const entityType = 'Files';

const enhance = compose(
  setDisplayName('RepoFileAggregations'),
  withTheme,
  withFacetSelection({
    entityType,
    presetFacetFields,
    validFacetDocTypes: ['files'],
  }),
  withState('fileIdCollapsed', 'setFileIdCollapsed', false),
  withPropsOnChange(['viewer'], ({ viewer }) => ({
    parsedFacets: viewer.repository.files.facets
      ? tryParseJSON(viewer.repository.files.facets, {})
      : {},
  })),
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
  facets: { facets: string },
  parsedFacets: Object,
  aggregations: {
    access: { buckets: [IBucket] },
    data_category: { buckets: [IBucket] },
    data_format: { buckets: [IBucket] },
    data_type: { buckets: [IBucket] },
    experimental_strategy: { buckets: [IBucket] },
    platform: { buckets: [IBucket] },
    analysis__workflow_type: { buckets: [IBucket] },
  },
  theme: Object,
  suggestions: Array<Object>,
  setAutocomplete: Function,

  userSelectedFacets: Array<{
    description: String,
    doc_type: String,
    field: String,
    full: String,
    type: 'id' | 'string' | 'long',
  }>,
  handleSelectFacet: Function,
  handleResetFacets: Function,
  handleRequestRemoveFacet: Function,
  presetFacetFields: Array<String>,
  shouldShowFacetSelection: Boolean,
  facetExclusionTest: Function,
  setShouldShowFacetSelection: Function,
};

const FileAggregations = (props: TProps) => (
  <div className="test-file-aggregations">
    <div
      className="text-right"
      style={{
        padding: '10px 15px',
        borderBottom: `1px solid ${props.theme.greyScale5}`,
      }}
    >
      {!!props.userSelectedFacets.length && (
        <span>
          <a onClick={props.handleResetFacets} style={styles.link}>
            Reset
          </a>{' '}
          &nbsp;|&nbsp;
        </span>
      )}
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
        relayVarName="repoCustomFacetFields"
        docType="files"
        onSelect={props.handleSelectFacet}
        onRequestClose={() => props.setShouldShowFacetSelection(false)}
        excludeFacetsBy={props.facetExclusionTest}
        additionalFacetData={props.parsedFacets}
        relay={props.relay}
      />
    </Modal>

    {props.userSelectedFacets.map(facet => (
      <FacetWrapper
        isRemovable
        relayVarName="repoFileCustomFacetFields"
        key={facet.full}
        facet={facet}
        aggregation={props.parsedFacets[facet.field]}
        onRequestRemove={() => props.handleRequestRemoveFacet(facet)}
        style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
      />
    ))}
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
      queryType="file"
      placeholder="e.g. 142682.bam, 4f6e2e7a-b..."
      style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
      dropdownItem={x => (
        <Row>
          <FileIcon style={{ paddingRight: '1rem', paddingTop: '1rem' }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{x.file_id}</div>
            <div style={{ fontSize: '80%' }}>{x.submitter_id}</div>
            {x.file_name}
          </div>
        </Row>
      )}
    />
    {_.reject(presetFacets, { full: 'files.file_id' }).map(facet => (
      <FacetWrapper
        key={facet.full}
        facet={facet}
        title={facet.title}
        aggregation={
          props.viewer.repository.files.aggregations[
            escapeForRelay(facet.field)
          ]
        }
        relay={props.relay}
        style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
        additionalProps={facet.additionalProps}
      />
    ))}
  </div>
);

export default enhance(FileAggregations);
