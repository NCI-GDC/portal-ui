/* @flow */
import React from 'react';
import { reject } from 'lodash';
import {
  compose,
  withState,
  setDisplayName,
} from 'recompose';

import SuggestionFacet from '@ncigdc/modern_components/SuggestionFacet';
import { Row } from '@ncigdc/uikit/Flex';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import UploadSetButton from '@ncigdc/components/UploadSetButton';
import CaseIcon from '@ncigdc/theme/icons/Case';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import { UploadCaseSet } from '@ncigdc/components/Modals/UploadSet';
import { presetFacets } from '@ncigdc/containers/explore/presetFacets';

// import { IBucket } from '@ncigdc/components/Aggregations/types';

export interface ITProps {
  caseIdCollapsed: boolean,
  setCaseIdCollapsed: (caseIdCollapsed: boolean) => void,
  relay: any,
  // aggregations: {
  //   demographic__ethnicity: { buckets: [IBucket] },
  //   demographic__gender: { buckets: [IBucket] },
  //   demographic__race: { buckets: [IBucket] },
  //   diagnoses__vital_status: { buckets: [IBucket] },
  //   diagnoses__days_to_death: { max: number, min: number },
  //   diagnoses__age_at_diagnosis: { max: number, min: number },
  //   disease_type: { buckets: [IBucket] },
  //   primary_site: { buckets: [IBucket] },
  //   project__program__name: { buckets: [IBucket] },
  //   project__project_id: { buckets: [IBucket] },
  // },
  advancedFilter: boolean,
  setAdvancedFilter: any,
  maxFacetsPanelHeight: number,
}

const enhance = compose(
  setDisplayName('ExploreCaseAggregations_modern'),
  withState('caseIdCollapsed', 'setCaseIdCollapsed', false),
  withState('advancedFilter', 'setAdvancedFilter', false),
);

const CaseAggregations = ({
  // advancedFilter,
  caseIdCollapsed,
  maxFacetsPanelHeight,
  relay,
  // setAdvancedFilter,
  setCaseIdCollapsed,
  totalHeaderHeight = 68, // 68 is the height of all elements above this div.
  viewer: { explore: { cases: { aggregations } } },
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
      dropdownItem={caseItem => (
        <Row>
          <CaseIcon
            style={{
              paddingRight: '1rem',
              paddingTop: '1rem',
            }}
            />
          <div>
            <div style={{ fontWeight: 'bold' }}>{caseItem.case_id}</div>
            <div style={{ fontSize: '80%' }}>{caseItem.submitter_id}</div>
            {caseItem.project.project_id}
          </div>
        </Row>
      )}
      fieldNoDoctype="case_id"
      placeholder="e.g. TCGA-A5-A0G2, 432fe4a9-2..."
      queryType="case"
      title="Case"
      />

    <UploadSetButton
      defaultQuery={{
        pathname: '/exploration',
        query: { searchTableTab: 'cases' },
      }}
      idField="cases.case_id"
      style={{
        padding: '0 1.2rem 1rem',
        width: '100%',
      }}
      type="case"
      UploadModal={UploadCaseSet}
      >
      Upload Case Set
    </UploadSetButton>

    <div
      style={{
        maxHeight: `${maxFacetsPanelHeight - totalHeaderHeight}px`,
        overflowY: 'scroll',
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

export default enhance(CaseAggregations);
