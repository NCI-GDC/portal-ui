import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import {
  compose,
  withState,
  lifecycle,
  withProps,
  withHandlers,
  withPropsOnChange,
} from 'recompose';
import { fetchApi } from '@ncigdc/utils/ajax';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import { withTheme } from '@ncigdc/theme';
import RecursiveToggledFacet from './RecursiveToggledFacet';
import { CaseAggregationsQuery } from '@ncigdc/containers/explore/explore.relay';
// import { ResultHighlights } from '@ncigdc/components/QuickSearch/QuickSearchResults';
import SearchIcon from 'react-icons/lib/fa/search';
import { Row } from '@ncigdc/uikit/Flex';
import styled from '@ncigdc/theme/styled';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import withFacetSelection from '@ncigdc/utils/withFacetSelection';
import presetFacets from '@ncigdc/containers/explore/presetFacets';
import Input from '@ncigdc/uikit/Form/Input';
interface IFacetProps {
  description: string,
  doc_type: string,
  field: string,
  full: string,
  type: string,
}
const facetMatchesQuery = (facet: IFacetProps, searchValue: string): boolean =>
  _.some([facet.field, facet.description].map(_.toLower), searchTarget =>
    _.includes(searchTarget, searchValue)
  );
const MagnifyingGlass = styled(SearchIcon, {
  backgroundColor: ({ theme }: any) => theme.greyScale5,
  color: ({ theme }: any) => theme.greyScale2,
  padding: '0.8rem',
  width: '3.4rem',
  height: '3.4rem',
  borderRadius: '4px 0 0 4px',
  border: ({ theme }: any) => `1px solid ${theme.greyScale4}`,
  borderRight: 'none',
});
const advancedPresetFacets = [
  {
    title: 'Demographic',
    field: 'demographic',
    full: 'demographic',
  },
  {
    title: 'Diagnoses',
    field: 'diagnoses',
    full: 'diagnoses',
    excluded: ['treatments'],
  },
  {
    title: 'Treatments',
    field: 'treatments',
    full: 'diagnoses.treatments',
  },
  {
    title: 'Exposures',
    field: 'exposures',
    full: 'exposures',
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
const presetFacetFields = presetFacets.map(x => x.field);

const FacetWrapperDiv = styled(`div`, {
  position: 'relative',
});

const NestedWrapper = ({
  Component,
  title,
  isCollapsed,
  setCollapsed,
  style,
  headerStyle,
  isLoading,
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
    {isCollapsed ||
      (isLoading ? <div style={{ marginLeft: '1rem' }}>...</div> : Component)}
  </FacetWrapperDiv>
);

const enhance = compose(
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
  withPropsOnChange(['filters'], ({ filters, relay }) =>
    relay.setVariables({
      filters,
    })
  ),
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
  ),
  withPropsOnChange(
    ['facets', 'facetMapping', 'searchValue', 'shouldHideUselessFacets'],
    ({
      facets,
      facetMapping,
      searchValue,
      shouldHideUselessFacets,
      facetExclusionTest,
    }) => {
      const parsedFacets = facets.facets ? tryParseJSON(facets.facets, {}) : {};
      const usefulFacets = _.omitBy(
        parsedFacets,
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
      );

      const filteredFacets = _.filter(_.values(facetMapping), facet =>
        _.every([
          facetMatchesQuery(facet, searchValue),
          !facetExclusionTest(facet),
          !shouldHideUselessFacets ||
            Object.keys(usefulFacets).includes(facet.field),
        ])
      );
      const fieldHash = {};
      let key = '';
      for (const str of filteredFacets.map((f: any) => f.field)) {
        const el = str.split('.');
        let subFieldHash = fieldHash;
        while (el.length >= 1) {
          key = el.shift() || '';
          if (el.length === 0) {
            subFieldHash[key] = facetMapping['cases.' + str];
          } else {
            subFieldHash[key] = subFieldHash[key] || {};
            subFieldHash = subFieldHash[key];
          }
        }
      }
      return {
        parsedFacets,
        filteredFacets,
        fieldHash,
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
      props.relay.setVariables({
        filters: props.filters,
      });
    },
  })
)(
  withTheme(
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
      aggregations,
      relay,
      toggledTree,
      setToggledTree,
      suggestions,
      additionalFacetData,
      searchValue,
      setSearchValue,
      handleQueryInputChange,
      fieldHash,
      parsedFacets,
      isLoadingParsedFacets,
      isLoadingFacetMapping,
    }: any): any => {
      return [
        <Row
          style={{
            margin: '2.5rem 1rem 0 0.5rem',
          }}
          key="row"
        >
          <label>
            <MagnifyingGlass />
          </label>
          <Input
            style={{
              borderRadius: '0 4px 4px 0',
              marginBottom: '6px',
            }}
            defaultValue={searchValue}
            onChange={handleQueryInputChange}
            placeholder={'Search...'}
            aria-label="Search..."
            autoFocus
          />
        </Row>,
        <label key="label">
          <input
            className="test-filter-useful-facet"
            type="checkbox"
            onChange={event => setUselessFacetVisibility(event.target.checked)}
            checked={shouldHideUselessFacets}
            style={{ margin: '12px' }}
          />
          Only show fields with values ({isLoadingParsedFacets ||
          isLoadingFacetMapping
            ? '...'
            : Object.keys(filteredFacets).length}{' '}
          fields now)
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
                borderBottom: `1px solid ${theme.greyScale5}`,
                position: 'relative',
              }}
              Component={
                <RecursiveToggledFacet
                  hash={_.omit(
                    _.get(fieldHash, facet.full, {}),
                    facet.excluded || ''
                  )}
                  Component={(componentFacet: { [x: string]: any }) => [
                    <FacetWrapper
                      relayVarName="exploreCaseCustomFacetFields"
                      key={componentFacet.full}
                      facet={componentFacet}
                      title={_.startCase(componentFacet.full.split('.').pop())}
                      aggregation={parsedFacets[componentFacet.field]}
                      relay={relay}
                      additionalProps={{ style: { paddingBottom: 0 } }}
                      style={{
                        position: 'relative',
                        paddingLeft: '10px',
                      }}
                      headerStyle={{ fontSize: '14px' }}
                      collapsed={true}
                      maxNum={5}
                    />,
                    // <div key={componentFacet.description}>
                    //   {searchValue.length > 0 ? (
                    //     <ResultHighlights
                    //       item={componentFacet.description}
                    //       query={searchValue}
                    //       style={{ position: 'relative' }}
                    //     />
                    //   ) : null}
                    // </div>,
                  ]}
                  key={facet.title + 'RecursiveToggledBox'}
                />
              }
              angleIconRight
              title={facet.title}
              isCollapsed={toggledTree[facet.field].toggled}
              setCollapsed={() =>
                setToggledTree({
                  ...toggledTree,
                  [facet.field]: {
                    ...toggledTree[facet.field],
                    toggled: !toggledTree[facet.field].toggled,
                  },
                })}
              isLoading={isLoadingParsedFacets || isLoadingFacetMapping}
            />
          );
        }),
      ];
    }
  )
);

const ClinicalAggregations = Relay.createContainer(
  enhance,
  CaseAggregationsQuery
);
export default ClinicalAggregations;
