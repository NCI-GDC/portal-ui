/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';
import { reject } from 'lodash';
import {
  compose,
  withState,
  setDisplayName,
  lifecycle,
  withPropsOnChange,
} from 'recompose';

import SuggestionFacet from '@ncigdc/components/Aggregations/SuggestionFacet';
import { Row } from '@ncigdc/uikit/Flex';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import UploadSetButton from '@ncigdc/components/UploadSetButton';
import { withTheme } from '@ncigdc/theme';
import CaseIcon from '@ncigdc/theme/icons/Case';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import { UploadCaseSet } from '@ncigdc/components/Modals/UploadSet';
import { presetFacets } from '@ncigdc/containers/explore/presetFacets';

import { IBucket } from '@ncigdc/components/Aggregations/types';
import CaseAggregationsQuery from './explore.relay';

export interface ITProps {
  caseIdCollapsed: boolean,
  setCaseIdCollapsed: (caseIdCollapsed: boolean) => void,
  relay: any,
  facets: { facets: string },
  parsedFacets: any,
  aggregations: {
    demographic__ethnicity: { buckets: [IBucket] },
    demographic__gender: { buckets: [IBucket] },
    demographic__race: { buckets: [IBucket] },
    diagnoses__vital_status: { buckets: [IBucket] },
    diagnoses__days_to_death: { max: number, min: number },
    diagnoses__age_at_diagnosis: { max: number, min: number },
    disease_type: { buckets: [IBucket] },
    primary_site: { buckets: [IBucket] },
    project__program__name: { buckets: [IBucket] },
    project__project_id: { buckets: [IBucket] },
  },
  hits: {
    edges: Array<{
      node: {
        id: string,
      },
    }>,
  },
  setAutocomplete: any,
  theme: any,
  filters: any,
  suggestions: any,
  handleSelectFacet: any,
  handleResetFacets: (event: any) => void,
  handleRequestRemoveFacet: any,
  shouldShowFacetSelection: boolean,
  facetExclusionTest: any,
  setShouldShowFacetSelection: any,
  advancedFilter: boolean,
  setAdvancedFilter: any,
  maxFacetsPanelHeight: number,
}

const enhance = compose(
  setDisplayName('ExploreCaseAggregations'),
  withState('caseIdCollapsed', 'setCaseIdCollapsed', false),
  withState('advancedFilter', 'setAdvancedFilter', false),
  withPropsOnChange(['filters'], ({ filters, relay }) => relay.setVariables({
    filters,
  })),
  withPropsOnChange(['facets'], ({ facets }) => ({
    parsedFacets: facets.facets ? tryParseJSON(facets.facets, {}) : {},
  })),
  lifecycle({
    componentDidMount(): void {
      const { filters, relay }: any = this.props;
      relay.setVariables({
        filters,
      });
    },
  }),
);

export const CaseAggregationsComponent = ({
  advancedFilter,
  aggregations,
  caseIdCollapsed,
  facets,
  filters,
  handleRequestRemoveFacet,
  handleResetFacets,
  handleSelectFacet,
  hits,
  maxFacetsPanelHeight,
  parsedFacets,
  relay,
  setAdvancedFilter,
  setAutocomplete,
  setCaseIdCollapsed,
  setShouldShowFacetSelection,
  shouldShowFacetSelection,
  suggestions,
  theme,
}: ITProps) => (
  <div className="test-case-aggregations">
      <FacetHeader
        collapsed={caseIdCollapsed}
        description="Enter UUID or ID of Case, Sample, Portion, Slide, Analyte or Aliquot"
        field="cases.case_id"
        setCollapsed={setCaseIdCollapsed}
        title="Case"
        />
      <SuggestionFacet
        collapsed={caseIdCollapsed}
        doctype="cases"
        dropdownItem={(x: any) => (
          <Row>
            <CaseIcon style={{
              paddingRight: '1rem',
              paddingTop: '1rem',
            }}
                      />
            <div>
              <div style={{ fontWeight: 'bold' }}>{x.case_id}</div>
              <div style={{ fontSize: '80%' }}>{x.submitter_id}</div>
              {x.project.project_id}
            </div>
          </Row>
        )}
        fieldNoDoctype="case_id"
        hits={suggestions}
        placeholder="e.g. TCGA-A5-A0G2, 432fe4a9-2..."
        setAutocomplete={setAutocomplete}
        title="Case"
        />
      <UploadSetButton
        defaultQuery={{
          pathname: '/exploration',
          query: { searchTableTab: 'cases' },
        }}
        idField="cases.case_id"
        style={{
          width: '100%',
          padding: '0 1.2rem 1rem',
        }}
        type="case"
        UploadModal={UploadCaseSet}
        >
        Upload Case Set
      </UploadSetButton>
      <div
        style={{
          overflowY: 'scroll',
          maxHeight: `${maxFacetsPanelHeight - 68}px`, // 68 is the height of all elements above this div.
          paddingBottom: '20px',
        }}
        >
        {reject(presetFacets, { full: 'cases.case_id' })
          .filter(facet => aggregations[escapeForRelay(facet.field)])
          .map(facet => (
            <FacetWrapper
              aggregation={aggregations[escapeForRelay(facet.field)]}
              facet={facet}
              key={facet.full}
              relay={relay}
              title={facet.title}
              />
          ))}
      </div>
    </div>
);

const CaseAggregations = Relay.createContainer(
  enhance(withTheme(CaseAggregationsComponent)),
  CaseAggregationsQuery,
);

export default CaseAggregations;
