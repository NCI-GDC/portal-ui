import React from 'react';
import {
  compose,
  branch,
  renderComponent,
  withState,
  withProps,
  lifecycle,
  withHandlers,
  withPropsOnChange,
} from 'recompose';
import _ from 'lodash';

import { Row, Column } from '@ncigdc/uikit/Flex';
import { theme } from '@ncigdc/theme/index';
import { withTheme } from '@ncigdc/theme';
import FacetWrapper from '@ncigdc/components/FacetWrapper';

import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import CaseIcon from '@ncigdc/theme/icons/Case';
import { UploadCaseSet } from '@ncigdc/components/Modals/UploadSet';
import SuggestionFacet from '@ncigdc/components/Aggregations/SuggestionFacet';
import UploadSetButton from '@ncigdc/components/UploadSetButton';
import SearchIcon from 'react-icons/lib/fa/search';
import styled from '@ncigdc/theme/styled';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import withFacetSelection from '@ncigdc/utils/withFacetSelection';
import presetFacets from '@ncigdc/containers/explore/presetFacets';
import Input from '@ncigdc/uikit/Form/Input';
import withFacets from '@ncigdc/modern_components/IntrospectiveType/Introspective.relay.js';
import ClinicalAggregations from '@ncigdc/modern_components/ClinicalAggregations';

import { CLINICAL_PREFIXES, CLINICAL_BLACKLIST } from '@ncigdc/utils/constants';
const entityType = 'ExploreCases';
const presetFacetFields = presetFacets.map(x => x.field);

const MAX_VISIBLE_FACETS = 5;

const MagnifyingGlass = styled(SearchIcon, {
  marginLeft: '1rem',
  position: 'relative',
  width: '3rem',
  height: '3rem',
  ':hover::before': {
    textShadow: ({
      theme,
    }: {
      theme: { textShadow: string, [x: string]: any },
    }) => theme.textShadow,
  },
});

const ClinicalAggregationsWithFacets = withFacets(props => {
  if (!props.__type) {
    return <div>Data not available for {props.name}</div>;
  }
  const { fields, name, description } = props.__type;
  if (!fields) {
    return <div>No fields found</div>;
  }
  const facetPrefix = CLINICAL_PREFIXES[props.name].replace('cases.', '');
  const whitelistedFields = fields.filter(
    field => !CLINICAL_BLACKLIST.includes(field.name)
  );
  const facets = whitelistedFields
    .map(field => `${facetPrefix}.${field.name}`)
    .join();

  const parsedFields = whitelistedFields.map(f => {
    const fType = f.type.name === 'String' ? 'terms' : f.type.name;
    return {
      field: f.name,
      description: f.description,
      full: `${CLINICAL_PREFIXES[props.name]}.${f.name}`,
      type: fType,
      doc_type: 'cases',
    };
  });

  return (
    <ClinicalAggregations
      facets={facets}
      fields={parsedFields}
      name={props.name}
      shouldHideUselessFacets={props.shouldHideUselessFacets}
      entityType={props.entityType}
    />
  );
});

const clinicalFacetTypes = Object.keys(CLINICAL_PREFIXES).filter(
  // key => key === 'Exposure'
  key => key !== 'Follow up' && key !== 'Molecular test' && key !== 'Treatment'
);

export default compose(
  // branch(
  //   ({ __type, name }) => !__type,
  //   renderComponent(({ __type, name }) => (
  //     <div style={{ paddingRight: 10 }}>No fields found.</div>
  //   ))
  // ),
  withTheme,
  withState('facetMapping', 'setFacetMapping', {}),
  withState('isLoadingFacetMapping', 'setIsLoadingFacetMapping', false),
  withState('isLoadingParsedFacets', 'setIsLoadingParsedFacets', false),
  withState('fieldHash', 'setFieldHash', {}),
  withState('caseIdCollapsed', 'setCaseIdCollapsed', false),
  withState('shouldHideUselessFacets', 'setShouldHideUselessFacets', false),
  withState('searchValue', 'setSearchValue', ''),
  withState('toggledTree', 'setToggledTree', {
    cases: { toggled: false },
    demographic: { toggled: false },
    diagnoses: { toggled: false },
    treatments: { toggled: false },
    exposures: { toggled: false },
    follow_up: { toggled: false },
    molecular_tests: { toggled: false },
  }),
  withProps(
    ({
      relay,
      setIsLoadingParsedFacets,
      setShouldHideUselessFacets,
      facetMapping,
      relayVarName,
      docType,
      shouldHideUselessFacets,
    }) => ({
      setUselessFacetVisibility: (shouldHide: boolean) => {
        setShouldHideUselessFacets(shouldHide);
        localStorage.setItem(
          'shouldHideUselessFacets',
          JSON.stringify(shouldHide)
        );
        const byDocType = _.groupBy(facetMapping, o => o.doc_type);

        if (shouldHide && byDocType[docType]) {
          setIsLoadingParsedFacets(shouldHide);
          relay.setVariables(
            {
              [relayVarName]: byDocType[docType]
                .map(({ field }) => field)
                .join(','),
            },
            (readyState: any) => {
              if (
                _.some([readyState.ready, readyState.aborted, readyState.error])
              ) {
                setIsLoadingParsedFacets(false);
              }
            }
          );
        }
      },
    })
  )
)(
  ({
    filteredFacets,
    facets,
    facetMapping,
    caseIdCollapsed,
    setCaseIdCollapsed,
    setAutocomplete,
    theme,
    setUselessFacetVisibility,
    shouldHideUselessFacets,
    relay,
    toggledTree,
    setToggledTree,
    suggestions,
    additionalFacetData,
    searchValue = '',
    setSearchValue = () => null,
    handleQueryInputChange = () => null,
    fieldHash,
    parsedFacets,
    isLoadingParsedFacets,
    isLoadingFacetMapping,
    ...props
  }) => {
    return (
      <Column style={{ marginBottom: 2 }}>
        <div>
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
                <CaseIcon
                  style={{ paddingRight: '1rem', paddingTop: '1rem' }}
                />
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
        </div>
        <Row style={{ marginRight: '1rem', marginTop: '0.5rem' }} key="row">
          <MagnifyingGlass />
          <Input
            style={{
              borderRadius: '4px',
              marginBottom: '6px',
              marginLeft: '0.5rem',
            }}
            defaultValue={searchValue}
            onChange={handleQueryInputChange}
            placeholder={'Search...'}
            aria-label="Search..."
            autoFocus
          />
        </Row>
        <label key="label" style={{ backgroundColor: 'pink' }}>
          <input
            className="test-filter-useful-facet"
            type="checkbox"
            onChange={event => setUselessFacetVisibility(event.target.checked)}
            checked={shouldHideUselessFacets}
            style={{ margin: '12px' }}
          />
          Only show fields with values (
          {/* {isLoadingParsedFacets || isLoadingFacetMapping
            ? '...'
            : Object.keys(filteredFacets).length}{' '} */}
          fields now)
        </label>
        {clinicalFacetTypes.map(facetType => (
          <ClinicalAggregationsWithFacets
            key={facetType}
            name={facetType}
            docType="cases"
            relayVarName="exploreCaseCustomFacetFields"
            relay={relay}
            shouldHideUselessFacets={shouldHideUselessFacets}
            entityType={entityType}
            // suggestions={_.get(viewer, 'autocomplete_cases.hits', [])}
            // setAutocomplete={(value, onReadyStateChange) =>
            //   relay.setVariables(
            //     {
            //       idAutocompleteCases: value,
            //       runAutocompleteCases: !!value,
            //     },
            //     onReadyStateChange
            //   )
            // }
          />
        ))}
      </Column>
    );
  }
);
