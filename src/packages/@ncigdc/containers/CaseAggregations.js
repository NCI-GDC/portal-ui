/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  compose,
  withState,
  setDisplayName,
  lifecycle,
  withPropsOnChange,
} from 'recompose';

import Modal from '@ncigdc/uikit/Modal';
import SuggestionFacet from '@ncigdc/components/Aggregations/SuggestionFacet';
import { Row } from '@ncigdc/uikit/Flex';
import FacetSelection from '@ncigdc/components/FacetSelection';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import UploadSetButton from '@ncigdc/components/UploadSetButton';
import { withTheme } from '@ncigdc/theme';
import CaseIcon from '@ncigdc/theme/icons/Case';
import withFacetSelection from '@ncigdc/utils/withFacetSelection';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import { UploadCaseSet } from '@ncigdc/components/Modals/UploadSet';

import type { TBucket } from '@ncigdc/components/Aggregations/types';

export type TProps = {
  caseIdCollapsed: boolean,
  setCaseIdCollapsed: Function,
  relay: Object,
  facets: { facets: string },
  parsedFacets: Object,
  aggregations: {
    demographic__ethnicity: { buckets: [TBucket] },
    demographic__gender: { buckets: [TBucket] },
    demographic__race: { buckets: [TBucket] },
    diagnoses__vital_status: { buckets: [TBucket] },
    diagnoses__days_to_death: { max: number, min: number },
    diagnoses__age_at_diagnosis: { max: number, min: number },
    disease_type: { buckets: [TBucket] },
    primary_site: { buckets: [TBucket] },
    project__program__name: { buckets: [TBucket] },
    project__project_id: { buckets: [TBucket] },
  },
  hits: {
    edges: Array<{|
      node: {|
        id: string,
      |},
    |}>,
  },
  setAutocomplete: Function,
  theme: Object,
  filters: Object,
  suggestions: Array<Object>,

  userSelectedFacets: Array<{|
    description: String,
    doc_type: String,
    field: String,
    full: String,
    type: 'id' | 'string' | 'long',
  |}>,
  handleSelectFacet: Function,
  handleResetFacets: Function,
  handleRequestRemoveFacet: Function,
  presetFacetFields: Array<String>,
  shouldShowFacetSelection: Boolean,
  facetExclusionTest: Function,
  setShouldShowFacetSelection: Function,
};

const presetFacets = [
  {
    title: 'Case',
    field: 'case_id',
    full: 'cases.case_id',
    doc_type: 'cases',
    type: 'id',
  },
  {
    title: 'Case ID',
    field: 'submitter_id',
    full: 'cases.submitter_id',
    doc_type: 'cases',
    type: 'id',
    placeholder: 'eg. TCGA-DD*, *DD*, TCGA-DD-AAVP',
  },
  {
    title: 'Primary Site',
    field: 'primary_site',
    full: 'cases.primary_site',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Program',
    field: 'project.program.name',
    full: 'cases.project.program.name',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Project',
    field: 'project.project_id',
    full: 'cases.project.project_id',
    doc_type: 'cases',
    type: 'terms',
  },
  {
    title: 'Disease Type',
    field: 'disease_type',
    full: 'cases.disease_type',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Gender',
    field: 'demographic.gender',
    full: 'cases.demographic.gender',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Age at Diagnosis',
    field: 'diagnoses.age_at_diagnosis',
    full: 'cases.diagnoses.age_at_diagnosis',
    doc_type: 'cases',
    type: 'long',
    additionalProps: { convertDays: true },
  },
  {
    title: 'Vital Status',
    field: 'diagnoses.vital_status',
    full: 'cases.diagnoses.vital_status',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Days to Death',
    field: 'diagnoses.days_to_death',
    full: 'cases.diagnoses.days_to_death',
    doc_type: 'cases',
    type: 'long',
  },
  {
    title: 'Race',
    field: 'demographic.race',
    full: 'cases.demographic.race',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Ethnicity',
    field: 'demographic.ethnicity',
    full: 'cases.demographic.ethnicity',
    doc_type: 'cases',
    type: 'keyword',
  },
];

const presetFacetFields = presetFacets.map(x => x.field);

const entityType = 'RepositoryCases';
const enhance = compose(
  setDisplayName('RepoCaseAggregations'),
  withFacetSelection({
    entityType,
    presetFacetFields,
    validFacetDocTypes: ['cases'],
  }),
  withState('caseIdCollapsed', 'setCaseIdCollapsed', false),
  connect((state, props) => ({
    userSelectedFacets: state.customFacets[entityType],
  })),
  withPropsOnChange(
    ['filters', 'userSelectedFacets'],
    ({ filters, relay, userSelectedFacets }) =>
      relay.setVariables({
        filters,
        repoCaseCustomFacetFields: userSelectedFacets
          .map(({ field }) => field)
          .join(','),
      }),
  ),
  withPropsOnChange(['facets'], ({ facets }) => ({
    parsedFacets: facets.facets ? tryParseJSON(facets.facets, {}) : {},
  })),
  lifecycle({
    componentDidMount(): void {
      const { filters, userSelectedFacets } = this.props;
      this.props.relay.setVariables({
        filters: filters,
        repoCaseCustomFacetFields: userSelectedFacets
          .map(({ field }) => field)
          .join(','),
      });
    },
  }),
);

const styles = {
  link: {
    textDecoration: 'underline',
    color: '#2a72a5',
  },
};

export const CaseAggregationsComponent = (props: TProps) =>
  <div className="test-case-aggregations">
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
        Add a Case/Biospecimen Filter
      </a>
    </div>
    <Modal
      isOpen={props.shouldShowFacetSelection}
      style={{ content: { border: 0, padding: '15px' } }}
    >
      <FacetSelection
        title="Add a Case/Biospecimen Filter"
        relayVarName="repoCaseCustomFacetFields"
        docType="cases"
        onSelect={props.handleSelectFacet}
        onRequestClose={() => props.setShouldShowFacetSelection(false)}
        excludeFacetsBy={props.facetExclusionTest}
        additionalFacetData={props.parsedFacets}
        relay={props.relay}
      />
    </Modal>

    {props.userSelectedFacets.map(facet =>
      <FacetWrapper
        isRemovable
        key={facet.full}
        facet={facet}
        aggregation={props.parsedFacets[facet.field]}
        relay={props.relay}
        onRequestRemove={() => props.handleRequestRemoveFacet(facet)}
        style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
      />,
    )}

    <FacetHeader
      title="Case"
      field="cases.case_id"
      collapsed={props.caseIdCollapsed}
      setCollapsed={props.setCaseIdCollapsed}
      description={
        'Enter UUID or ID of Case, Sample, Portion, Slide, Analyte or Aliquot'
      }
    />

    <SuggestionFacet
      title="Case"
      collapsed={props.caseIdCollapsed}
      doctype="cases"
      fieldNoDoctype="case_id"
      placeholder="e.g. TCGA-A5-A0G2, 432fe4a9-2..."
      hits={props.suggestions}
      setAutocomplete={props.setAutocomplete}
      dropdownItem={x =>
        <Row>
          <CaseIcon style={{ paddingRight: '1rem', paddingTop: '1rem' }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{x.case_id}</div>
            <div style={{ fontSize: '80%' }}>{x.submitter_id}</div>
            {x.project.project_id}
          </div>
        </Row>}
    />
    <UploadSetButton
      type="case"
      style={{
        width: '100%',
        borderBottom: `1px solid ${props.theme.greyScale5}`,
        padding: '0 1.2rem 1rem',
      }}
      UploadModal={UploadCaseSet}
      defaultQuery={{
        pathname: '/repository',
        query: { searchTableTab: 'cases' },
      }}
      idField="cases.case_id"
    >
      Upload Case Set
    </UploadSetButton>
    {_.reject(presetFacets, { full: 'cases.case_id' }).map(facet =>
      <FacetWrapper
        key={facet.full}
        facet={facet}
        title={facet.title}
        aggregation={props.aggregations[escapeForRelay(facet.field)]}
        relay={props.relay}
        additionalProps={facet.additionalProps}
        style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
      />,
    )}
  </div>;

export const CaseAggregationsQuery = {
  initialVariables: {
    repoCaseCustomFacetFields: '',
    filters: null,
  },
  fragments: {
    facets: () => Relay.QL`
      fragment on RepositoryCases {
        facets(facets: $repoCaseCustomFacetFields filters: $filters)
      }
    `,
    aggregations: () => Relay.QL`
      fragment on CaseAggregations {
        primary_site {
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
        project__project_id {
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
        demographic__gender {
          buckets {
            doc_count
            key
          }
        }
        diagnoses__age_at_diagnosis {
          max
          min
          count
        }
        diagnoses__vital_status {
          buckets {
            doc_count
            key
          }
        }
        diagnoses__days_to_death {
          max
          min
          count
        }
        demographic__race {
          buckets {
            doc_count
            key
          }
        }
        demographic__ethnicity {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
};

const CaseAggregations = Relay.createContainer(
  enhance(withTheme(CaseAggregationsComponent)),
  CaseAggregationsQuery,
);

export default CaseAggregations;
