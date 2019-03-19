import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import {
  compose,
  withState,
  withProps,
  withHandlers,
  withPropsOnChange,
} from 'recompose';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import { withTheme } from '@ncigdc/theme';
import RecursiveToggledFacet from './RecursiveToggledFacet';
import { CaseAggregationsQuery } from '@ncigdc/containers/explore/explore.relay';
import { ResultHighlights } from '@ncigdc/components/QuickSearch/QuickSearchResults';
import SearchIcon from 'react-icons/lib/fa/search';
import { Row } from '@ncigdc/uikit/Flex';
import styled from '@ncigdc/theme/styled';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import withFacetSelection from '@ncigdc/utils/withFacetSelection';
import {
  presetFacets,
  clinicalFacets,
} from '@ncigdc/containers/explore/presetFacets';
import Input from '@ncigdc/uikit/Form/Input';
import { ITheme } from '@ncigdc/theme/types';
interface IFacetProps {
  description: string,
  doc_type: string,
  field: string,
  full: string,
  type: string,
}
interface IBucketProps {
  key: string,
  doc_count: number,
}

interface IToggledTreeProps {
  cases: { toggled: boolean, [x: string]: any },
  demographic: { toggled: boolean, [x: string]: any },
  diagnoses: { toggled: boolean, [x: string]: any },
  treatments: { toggled: boolean, [x: string]: any },
  exposures: { toggled: boolean, [x: string]: any },
  follow_up: { toggled: boolean, [x: string]: any },
  molecular_tests: { toggled: boolean, [x: string]: any },
}
interface IClinicalProps {
  filteredFacets: any,
  theme: ITheme,
  setUselessFacetVisibility: (uselessFacetVisibility: boolean) => void,
  shouldHideUselessFacets: boolean,
  toggledTree: IToggledTreeProps,
  setToggledTree: (toggledTree: IToggledTreeProps) => void,
  searchValue: string,
  setSearchValue: (searchValue: string) => void,
  handleQueryInputChange: () => void,
  fieldHash: { [x: string]: any },
  parsedFacets: { [x: string]: any },
  isLoadingParsedFacets: boolean,
}
const facetMatchesQuery = (
  facet: IFacetProps,
  elements: IBucketProps[],
  searchValue: string
): boolean => {
  return _.some(
    [
      _.replace(facet.field.split('.')[1], /_/g, ' '),
      ...(elements || []).map((e: IBucketProps) => e.key),
      facet.description,
    ]
      .filter((n: string) => n)
      .map(_.toLower),
    searchTarget =>
      _.includes(
        searchTarget.toLocaleLowerCase(),
        searchValue.toLocaleLowerCase()
      )
  );
};
const MagnifyingGlass = styled(SearchIcon, {
  backgroundColor: ({ theme }: { theme: ITheme }) => theme.greyScale5,
  color: ({ theme }: { theme: ITheme }) => theme.greyScale2,
  padding: '0.8rem',
  width: '3.4rem',
  height: '3.4rem',
  borderRadius: '4px 0 0 4px',
  border: ({ theme }: { theme: ITheme }) => `1px solid ${theme.greyScale4}`,
  borderRight: 'none',
});

interface INestedWrapperProps {
  Component: JSX.Element,
  title: string,
  isCollapsed: boolean,
  setCollapsed: (isCollapsed: boolean) => void,
  style: { [x: string]: string },
  headerStyle: { [x: string]: string },
  isLoading: boolean,
  angleIconRight: boolean,
}
interface IGraphFieldProps {
  __dataID: string,
  name: string,
  description: string,
  type: { name: string, __dataID: string },
}
const NestedWrapper = ({
  Component,
  title,
  isCollapsed,
  setCollapsed,
  style,
  headerStyle,
  isLoading,
  angleIconRight,
}: INestedWrapperProps) => (
  <div key={title + 'div'} style={style}>
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
  </div>
);

const enhance = compose(
  withState('isLoadingParsedFacets', 'setIsLoadingParsedFacets', false),
  withState('fieldHash', 'setFieldHash', {}),
  withState('caseIdCollapsed', 'setCaseIdCollapsed', false),
  withState('shouldHideUselessFacets', 'setShouldHideUselessFacets', true),
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
    entityType: 'ExploreCases',
    presetFacetFields: presetFacets.map(x => x.field),
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
  withPropsOnChange(
    ['caseFacets'],
    ({ caseFacets }: { caseFacets: { [x: string]: any, fields: any[] } }) => ({
      facetMapping: caseFacets.fields
        .filter((f: IGraphFieldProps) => f.name === 'aggregations')[0]
        .type.fields.filter(
          (f: {
            __dataID: string,
            name: string,
            description: string,
            type: { name: string, __dataID: string },
          }) => !f.name.startsWith('gene')
        )
        .reduce(
          (acc: { [x: string]: IFacetProps }, f: IGraphFieldProps) => ({
            ...acc,
            ['cases.' + f.name.replace(/__/g, '.')]: {
              field: f.name.replace(/__/g, '.'),
              full: 'cases.' + f.name.replace(/__/g, '.'),
              doc_type: 'cases',
              description: f.description,
              type: f.type.name === 'Aggregations' ? 'keyword' : 'long',
            },
          }),
          {}
        ),
    })
  ),
  withPropsOnChange(
    ['globalFilters', 'facetMapping'],
    ({
      relay,
      facetMapping,
      globalFilters,
      setIsLoadingParsedFacets,
      relayVarName,
    }) => {
      setIsLoadingParsedFacets(true);
      relay.setVariables(
        {
          filters: globalFilters,
          [relayVarName]: _.values(facetMapping)
            .map(({ field }: { field: string }) => field)
            .join(','),
        },
        (readyState: { ready: boolean, aborted: boolean, error: boolean }) => {
          if (
            _.some([readyState.ready, readyState.aborted, readyState.error])
          ) {
            setIsLoadingParsedFacets(false);
          }
        }
      );
    }
  ),
  withProps(
    ({
      setIsLoadingParsedFacets,
      setShouldHideUselessFacets,
      relayVarName,
      facetMapping,
      docType,
      shouldHideUselessFacets,
      caseFacets,
    }) => ({
      setUselessFacetVisibility: (shouldHide: boolean) => {
        setShouldHideUselessFacets(shouldHide);
        localStorage.setItem(
          'shouldHideUselessFacets',
          JSON.stringify(shouldHide)
        );
      },
    })
  ),
  withPropsOnChange(
    ['facets', 'facetMapping', 'searchValue', 'shouldHideUselessFacets'],
    ({
      facets,
      docType,
      facetMapping,
      searchValue,
      relayVarName,
      shouldHideUselessFacets,
      facetExclusionTest,
    }) => {
      const parsedFacets = facets.facets ? tryParseJSON(facets.facets, {}) : {};
      const usefulFacets = _.omitBy(
        parsedFacets,
        (aggregation: {
          buckets: IBucketProps[],
          count: number,
          stats: { count: number, [x: string]: any },
        }) =>
          !aggregation ||
          _.some([
            aggregation.buckets &&
              aggregation.buckets.filter(
                (bucket: IBucketProps) => bucket.key !== '_missing'
              ).length === 0,
            aggregation.count === 0,
            aggregation.count === null,
            aggregation.stats && aggregation.stats.count === 0,
          ])
      );

      const filteredFacets = _.filter(_.values(facetMapping), facet => {
        return _.every([
          facetMatchesQuery(
            facet,
            _.get(parsedFacets[facet.field], 'buckets', undefined),
            searchValue
          ),
          !facetExclusionTest(facet),
          !shouldHideUselessFacets ||
            Object.keys(usefulFacets).includes(facet.field),
          !facet.field.endsWith('id'),
          !facet.field.includes('updated_datetime'),
          !facet.field.includes('created_datetime'),
        ]);
      });
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
    handleQueryInputChange: ({ setSearchValue }) => (event: any) =>
      setSearchValue(event.target.value),
  })
)(
  withTheme(
    ({
      filteredFacets,
      theme,
      setUselessFacetVisibility,
      shouldHideUselessFacets,
      toggledTree,
      setToggledTree,
      searchValue,
      setSearchValue,
      handleQueryInputChange,
      fieldHash,
      parsedFacets,
      isLoadingParsedFacets,
    }: IClinicalProps): any => {
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
          Only show fields with values ({isLoadingParsedFacets
            ? '...'
            : Object.keys(filteredFacets).length}{' '}
          fields shown)
        </label>,
        ...clinicalFacets
          .filter(
            facet => !searchValue || !!_.get(fieldHash, facet.full, false) // If the user is searching for something, hide the presetFacet with no value.
          )
          .map(facet => {
            return (
              <NestedWrapper
                key={facet.title + 'NestedWrapper'}
                style={{
                  position: 'relative',
                }}
                headerStyle={{
                  margin: '0.5rem 1rem 0rem 1rem',
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
                        isMatchingSearchValue={(componentFacet.full +
                          componentFacet.description
                        )
                          .toLocaleLowerCase()
                          .includes(searchValue.toLocaleLowerCase())}
                        facet={componentFacet}
                        title={_.startCase(
                          componentFacet.full.split('.').pop()
                        )}
                        aggregation={parsedFacets[componentFacet.field]}
                        searchValue={searchValue}
                        additionalProps={{ style: { paddingBottom: 0 } }}
                        style={{
                          position: 'relative',
                          paddingLeft: '10px',
                        }}
                        headerStyle={{ fontSize: '14px' }}
                        collapsed={searchValue.length === 0}
                        maxNum={5}
                      />,
                      <div key={componentFacet.description}>
                        {searchValue.length > 0 ? (
                          <ResultHighlights
                            item={{ description: componentFacet.description }}
                            query={searchValue}
                            heighlightStyle={{ backgroundColor: '#FFFF00' }}
                            style={{
                              fontStyle: 'italic',
                              position: 'relative',
                              paddingLeft: '30px',
                              paddingRight: '10px',
                            }}
                          />
                        ) : null}
                      </div>,
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
                isLoading={isLoadingParsedFacets}
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
