import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import {
  compose,
  withState,
  lifecycle,
  withProps,
  defaultProps,
  withHandlers,
  withPropsOnChange,
} from 'recompose';
import { fetchApi } from '@ncigdc/utils/ajax';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import CaseIcon from '@ncigdc/theme/icons/Case';
import { withTheme } from '@ncigdc/theme';
import { UploadCaseSet } from '@ncigdc/components/Modals/UploadSet';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';
import RecursiveToggledFacet from './RecursiveToggledFacet';
import { CaseAggregationsQuery } from './explore.relay';
import SuggestionFacet from '@ncigdc/components/Aggregations/SuggestionFacet';
import UploadSetButton from '@ncigdc/components/UploadSetButton';
import SearchIcon from 'react-icons/lib/fa/search';
import { Row } from '@ncigdc/uikit/Flex';
import Input from '@ncigdc/uikit/Form/Input';
import styled from '@ncigdc/theme/styled';
import withFacetSelection from '@ncigdc/utils/withFacetSelection';

const facetMatchesQuery = (facet: any, searchValue: any) =>
  _.some([facet.field, facet.description].map(_.toLower), searchTarget =>
    _.includes(searchTarget, searchValue)
  );
const MagnifyingGlass = styled(SearchIcon, {
  marginLeft: '1rem',
  position: 'relative',
  width: '3rem',
  height: '3rem',
  ':hover::before': {
    textShadow: ({ theme }: any) => theme.textShadow,
  },
});

const advancedPresetFacets = [
  {
    title: 'Demographic',
    field: 'demographic',
    full: 'cases.demographic',
  },
  {
    title: 'Diagnoses',
    field: 'diagnoses',
    full: 'cases.diagnoses',
    excluded: ['treatments'],
  },
  {
    title: 'Treatments',
    field: 'treatments',
    full: 'cases.diagnoses.treatments',
  },
  {
    title: 'Exposures',
    field: 'exposures',
    full: 'cases.exposures',
  },
  {
    title: 'Follow Up',
    field: 'follow_up',
    full: '',
  },
  {
    title: 'Molecular Tests',
    field: 'molecular_tests',
    full: '',
  },
];
const entityType = 'ExploreCases';
const presetFacetFields = advancedPresetFacets.map(x => x.field);
// @ts-ignore
const FacetWrapperDiv = styled.div({
  position: 'relative',
});

const NestedWrapper = ({
  Component,
  title,
  isCollapsed,
  setCollapsed,
  style,
  headerStyle,
}: any) => (
  <FacetWrapperDiv key={title + 'div'} style={style}>
    <FacetHeader
      title={title}
      collapsed={isCollapsed}
      setCollapsed={setCollapsed}
      key={title}
      style={headerStyle}
      angleIconRight
    />
    {isCollapsed || Component}
  </FacetWrapperDiv>
);

const enhance = compose(
  withState('facetMapping', 'setFacetMapping', {}),
  withState('isLoadingFacetMapping', 'setIsLoadingFacetMapping', false),
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
  withFacetSelection({
    entityType,
    presetFacetFields,
    validFacetDocTypes: ['cases'],
    validFacetPrefixes: [
      'cases.demographic',
      'cases.diagnoses',
      'cases.diagnoses.treatments',
      'cases.exposures',
      'cases.follow_up',
      'cases.molecular_tests',
    ],
  }),
  withPropsOnChange(['additionalFacetData'], ({ additionalFacetData }) => ({
    usefulFacets: _.omitBy(
      additionalFacetData,
      (aggregation: { [t: string]: any }) =>
        !aggregation ||
        _.some([
          aggregation.buckets &&
            aggregation.buckets.filter(
              (bucket: any) => bucket.key !== '_missing'
            ).length === 0,
          aggregation.count === 0,
          aggregation.count === null,
          aggregation.stats && aggregation.stats.count === 0,
        ])
    ),
  })),
  defaultProps({
    excludeFacetsBy: () => undefined,
    onRequestClose: () => undefined,
  }),
  // withPropsOnChange(
  //   ['filters', 'userSelectedFacets'],
  //   ({ filters, relay, userSelectedFacets }) =>
  //     relay.setVariables({
  //       filters,
  //       exploreCaseCustomFacetFields: userSelectedFacets
  //         .map(({ field }: any) => field)
  //         .join(','),
  //     })
  // ),
  withProps(
    ({
      relay,
      setIsLoadingAdditionalFacetData,
      setShouldHideUselessFacets,
      facetMapping,
      relayVarName,
      docType,
    }) => ({
      setUselessFacetVisibility: (shouldHideUselessFacets: any) => {
        setShouldHideUselessFacets(shouldHideUselessFacets);
        localStorage.setItem(
          'shouldHideUselessFacets',
          JSON.stringify(shouldHideUselessFacets)
        );
        const byDocType = _.groupBy(facetMapping, o => o.doc_type);
        if (shouldHideUselessFacets && byDocType[docType]) {
          setIsLoadingAdditionalFacetData(shouldHideUselessFacets);
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
                setIsLoadingAdditionalFacetData(false);
              }
            }
          );
        }
      },
    })
  ),
  withProps(
    ({
      facetMapping,
      excludeFacetsBy,
      searchValue,
      shouldHideUselessFacets,
      usefulFacets,
    }) => {
      return {
        filteredFacets: _.filter(_.values(facetMapping), facet =>
          _.every([
            facetMatchesQuery(facet, searchValue),
            !excludeFacetsBy(facet),
            !shouldHideUselessFacets ||
              Object.keys(usefulFacets).includes(facet.field),
          ])
        ),
      };
    }
  ),
  withHandlers({
    fetchData: ({ setFacetMapping, setIsLoadingFacetMapping }) => async () => {
      setIsLoadingFacetMapping(true);
      const mapping = await fetchApi('gql/_mapping', {
        headers: { 'Content-Type': 'application/json' },
      });
      setFacetMapping(mapping);
      setIsLoadingFacetMapping(false);
    },
    handleQueryInputChange: ({ setSearchValue }) => (event: any) =>
      setSearchValue(event.target.value),
  }),
  lifecycle({
    componentDidMount(): void {
      const { props }: any = this;
      props.fetchData();
    },
  })
)(
  withTheme((props: any): any => {
    const fieldHash = {};
    const fieldArray = Object.keys(props.facetMapping);
    let key = '';
    for (const str of fieldArray) {
      const el = str.split('.');
      let subFieldHash = fieldHash;
      while (el.length >= 1) {
        key = el.shift() || '';
        if (el.length === 0) {
          subFieldHash[key] = props.facetMapping[str];
        } else {
          subFieldHash[key] = subFieldHash[key] || {};
          subFieldHash = subFieldHash[key];
        }
      }
    }
    console.log('fieldHash', fieldHash);

    let input: any = '';
    return [
      <div key="header">
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
            borderBottom: `1px solid ${props.theme.greyScale5}`,
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
      </div>,

      <Row style={{ marginRight: '1rem', marginTop: '0.5rem' }} key="row">
        <MagnifyingGlass />
        <Input
          getNode={(node: any) => {
            input = node;
          }}
          style={{
            borderRadius: '4px',
            marginBottom: '6px',
            marginLeft: '0.5rem',
          }}
          onChange={() => props.setFilter(input.value)}
          placeholder={'Search...'}
          aria-label="Search..."
          autoFocus
        />
      </Row>,
      <label key="label">
        <input
          className="test-filter-useful-facet"
          type="checkbox"
          onChange={event =>
            props.setUselessFacetVisibility(event.target.checked)}
          checked={props.shouldHideUselessFacets}
          style={{ margin: '12px' }}
        />
        Only show fields with values
      </label>,
      ...advancedPresetFacets.map(facet => {
        return (
          <NestedWrapper
            key={facet.title + 'NestedWrapper'}
            style={{
              position: 'relative',
            }}
            headerStyle={{
              marginLeft: '1rem',
              marginRight: '1rem',
              marginTop: '0.5rem',
              backgroundColor: '#eeeeee',
              borderBottom: `1px solid ${props.theme.greyScale5}`,
              position: 'relative',
            }}
            Component={
              <RecursiveToggledFacet
                hash={_.omit(
                  _.get(fieldHash, facet.full, {}),
                  facet.excluded || ''
                )}
                Component={(componentFacet: any) => (
                  <FacetWrapper
                    relayVarName="exploreCaseCustomFacetFields"
                    key={componentFacet.full}
                    facet={componentFacet}
                    title={_.startCase(componentFacet.full.split('.').pop())}
                    aggregation={
                      props.aggregations[escapeForRelay(componentFacet.field)]
                    }
                    relay={props.relay}
                    additionalProps={{ style: { paddingBottom: 0 } }}
                    style={{
                      position: 'relative',
                      paddingLeft: '10px',
                    }}
                    headerStyle={{ fontSize: '14px' }}
                    collapsed={true}
                    maxNum={5}
                  />
                )}
                key={facet.title + 'RecursiveToggledBox'}
              />
            }
            angleIconRight
            title={facet.title}
            isCollapsed={props.toggledTree[facet.field].toggled}
            setCollapsed={() =>
              props.setToggledTree({
                ...props.toggledTree,
                [facet.field]: {
                  ...props.toggledTree[facet.field],
                  toggled: !props.toggledTree[facet.field].toggled,
                },
              })}
          />
        );
      }),
    ];
  })
);

const CaseAggregations = Relay.createContainer(enhance, CaseAggregationsQuery);
export default CaseAggregations;
