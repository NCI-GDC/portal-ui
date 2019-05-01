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
import { CaseAggregationsQuery } from './explore.relay';

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
  maxHeight: number,
}

const enhance = compose(
  setDisplayName('ExploreCaseAggregations'),
  withState('caseIdCollapsed', 'setCaseIdCollapsed', false),
  withState('advancedFilter', 'setAdvancedFilter', false),
  withPropsOnChange(['filters'], ({ filters, relay }) =>
    relay.setVariables({
      filters,
    }),
  ),
  withPropsOnChange(['facets'], ({ facets }) => ({
    parsedFacets: facets.facets ? tryParseJSON(facets.facets, {}) : {},
  })),
  lifecycle({
    componentDidMount(): void {
      const { relay, filters }: any = this.props;
      relay.setVariables({
        filters,
      });
    },
  }),
);

export const CaseAggregationsComponent = ({
  caseIdCollapsed,
  setCaseIdCollapsed,
  relay,
  facets,
  parsedFacets,
  aggregations,
  hits,
  setAutocomplete,
  theme,
  filters,
  suggestions,
  handleSelectFacet,
  handleResetFacets,
  handleRequestRemoveFacet,
  shouldShowFacetSelection,
  setShouldShowFacetSelection,
  advancedFilter,
  setAdvancedFilter,
  maxHeight,
}: ITProps) => (
    <div className="test-case-aggregations">
      <FacetHeader
        title="Case"
        field="cases.case_id"
        collapsed={caseIdCollapsed}
        setCollapsed={setCaseIdCollapsed}
        description={
          'Enter UUID or ID of Case, Sample, Portion, Slide, Analyte or Aliquot'
        }
      />
      <SuggestionFacet
        title="Case"
        collapsed={caseIdCollapsed}
        doctype="cases"
        fieldNoDoctype="case_id"
        placeholder="e.g. TCGA-A5-A0G2, 432fe4a9-2..."
        hits={suggestions}
        setAutocomplete={setAutocomplete}
        dropdownItem={(x: any) => (
          <Row>
            <CaseIcon style={{ paddingRight: '1rem', paddingTop: '1rem' }} />
            <div>
              <div style={{ fontWeight: 'bold' }}>{x.case_id}</div>
              <div style={{ fontSize: '80%' }}>{x.submitter_id}</div>
              {x.project.project_id}
            </div>
          </Row>
        )}
      />
      <UploadSetButton
        type="case"
        style={{
          width: '100%',
          borderBottom: `1px solid ${theme.greyScale5}`,
          padding: '0 1.2rem 1rem',
        }}
        UploadModal={UploadCaseSet}
        defaultQuery={{
          pathname: '/exploration',
          query: { searchTableTab: 'cases' },
        }}
        idField="cases.case_id"
      >
        Upload Case Set
    </UploadSetButton>
      <div
        style={{
          overflowY: 'scroll',
          maxHeight: `${maxHeight - 68}px`,
          paddingBottom: '20px',
        }}
      >
        {reject(presetFacets, { full: 'cases.case_id' })
          .filter(facet => aggregations[escapeForRelay(facet.field)])
          .map(facet => (
            <FacetWrapper
              key={facet.full}
              facet={facet}
              title={facet.title}
              aggregation={aggregations[escapeForRelay(facet.field)]}
              relay={relay}
              style={{ borderBottom: `1px solid ${theme.greyScale5}` }}
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
