import React from 'react';
import Relay from 'react-relay/classic';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  compose,
  withState,
  withProps,
  withHandlers,
  withPropsOnChange,
} from 'recompose';
import { Column } from '@ncigdc/uikit/Flex';
import {
  addAllFacets,
  changeFacetNames,
  expandOneCategory,
  showingMoreByCategory,
} from '@ncigdc/dux/facetsExpandedStatus';
import { WrapperComponent } from '@ncigdc/components/FacetWrapper';
import { withTheme } from '@ncigdc/theme';
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
import AngleIcon from '@ncigdc/theme/icons/AngleIcon';
import {
  ToggleMoreLink,
  BottomRow,
} from '@ncigdc/components/Aggregations/TermAggregation';
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

interface IClinicalProps {
  filteredFacets: any,
  theme: ITheme,
  setUselessFacetVisibility: (uselessFacetVisibility: boolean) => void,
  shouldHideUselessFacets: boolean,
  searchValue: string,
  setSearchValue: (searchValue: string) => void,
  handleQueryInputChange: () => void,
  parsedFacets: { [x: string]: any },
  isLoadingParsedFacets: boolean,
  allExpanded: any,
  facetsExpandedStatus: any,
  dispatch: any,
  // showingMore: any,
  // setShowingMore: any,
  notifications: any,
}
const facetMatchesQuery = (
  facet: IFacetProps,
  elements: IBucketProps[],
  searchValue: string
): boolean => {
  return _.some(
    [
      _.replace(facet.field.split('.').pop() || '', /_/g, ' '),
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

interface IGraphFieldProps {
  __dataID: string,
  name: string,
  description: string,
  type: { name: string, __dataID: string },
}

const enhance = compose(
  connect((state: any) => ({
    facetsExpandedStatus: state.facetsExpandedStatus,
    notifications: state.bannerNotification,
    allExpanded: _.mapValues(state.facetsExpandedStatus, status =>
      _.some(_.values(status.facets))
    ),
  })),
  withState('isLoadingParsedFacets', 'setIsLoadingParsedFacets', false),
  withState('shouldHideUselessFacets', 'setShouldHideUselessFacets', true),
  withState('searchValue', 'setSearchValue', ''),
  // withState('showingMore', 'setShowingMore', ({ facetsExpandedStatus }) =>
  //   _.mapValues(facetsExpandedStatus, status => false)
  // ),
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
      dispatch,
    }) => {
      const parsedFacets = facets.facets ? tryParseJSON(facets.facets, {}) : {};
      const usefulFacets = _.omitBy(
        parsedFacets,
        (aggregation: {
          buckets: IBucketProps[],
          count: number,
          stats: { count: number, [x: string]: any },
        }) =>
          _.some([
            !aggregation,
            aggregation.buckets &&
              aggregation.buckets.filter(
                (bucket: IBucketProps) => bucket.key !== '_missing'
              ).length === 0,
            aggregation.count === 0,
            aggregation.count === null,
            aggregation.stats && aggregation.stats.count === 0,
          ])
      );
      const filteredFacets = clinicalFacets.reduce((acc, header) => {
        return {
          ...acc,
          [header.field]: _.filter(facetMapping, facet => {
            return _.every([
              facetMatchesQuery(
                facet,
                _.get(parsedFacets[facet.field], 'buckets', undefined),
                searchValue
              ),
              !facetExclusionTest(facet),
              !shouldHideUselessFacets || facet.field in usefulFacets,
              facet.full.startsWith(header.full),
              !header.excluded || !facet.full.startsWith(header.excluded),
              !facet.field.endsWith('id'),
              !facet.field.includes('updated_datetime'),
              !facet.field.includes('created_datetime'),
            ]);
          }),
        };
      }, {});
      dispatch(addAllFacets(filteredFacets));
      return {
        parsedFacets,
        filteredFacets,
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
      facetsExpandedStatus,
      searchValue,
      setSearchValue,
      handleQueryInputChange,
      parsedFacets,
      isLoadingParsedFacets,
      allExpanded,
      dispatch,
      // showingMore,
      notifications,
    }: // setShowingMore,
    IClinicalProps): any => {
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
            : _.values(filteredFacets).reduce(
                (acc: number, facet: IFacetProps[]) => acc + facet.length,
                0
              )}{' '}
          fields shown)
        </label>,
        ...clinicalFacets
          .filter(
            facet => !searchValue || filteredFacets[facet.field].length > 0 // If the user is searching for something, hide the presetFacet with no value.
          )
          .map(facet => {
            return (
              <div key={facet.title + 'div'}>
                <Row
                  style={{
                    position: 'sticky',
                    top: `calc(51px + ${notifications.filter(
                      (n: any) => !n.dismissed
                    ).length * 40}px)`,
                    background: '#eeeeee',
                    zIndex: 10,
                    cursor: 'pointer',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.2rem 0.5rem 1.2rem',
                    margin: '0.5rem 1rem 0rem 1rem',
                  }}
                >
                  <div
                    onClick={() => dispatch(changeFacetNames(facet.field, ''))}
                    style={{
                      color: theme.primary,
                      fontSize: '1.7rem',
                    }}
                  >
                    <AngleIcon
                      style={{
                        display: 'flex',
                        padding: '0.25rem 0.25rem 0.25rem 0rem',
                        float: 'left',
                        transform: `rotate(${facetsExpandedStatus[facet.field]
                          .expanded
                          ? 0
                          : 270}deg)`,
                      }}
                    />
                    {facet.title}
                  </div>
                  <span
                    onClick={() => {
                      dispatch(
                        expandOneCategory(
                          facet.field,
                          !allExpanded[facet.field]
                        )
                      );
                    }}
                    style={{
                      display: 'flex',
                      float: 'right',
                    }}
                  >
                    {searchValue || filteredFacets[facet.field].length === 0
                      ? null
                      : allExpanded[facet.field] ? 'Reset' : 'Expand All'}
                  </span>
                </Row>
                {facetsExpandedStatus[facet.field].expanded && (
                  <Column>
                    {_.orderBy(filteredFacets[facet.field], ['field'], ['asc'])
                      .slice(
                        0,
                        facetsExpandedStatus[facet.field].showingMore
                          ? Infinity
                          : 5
                      )
                      .map((componentFacet: any) => {
                        return [
                          <WrapperComponent
                            relayVarName="exploreCaseCustomFacetFields"
                            key={componentFacet.full}
                            isMatchingSearchValue={(componentFacet.full +
                              componentFacet.description
                            )
                              .toLocaleLowerCase()
                              .includes(searchValue.toLocaleLowerCase())}
                            facet={componentFacet}
                            allExpanded={allExpanded[facet.field]}
                            title={_.startCase(
                              componentFacet.full.split('.').pop()
                            )}
                            aggregation={parsedFacets[componentFacet.field]}
                            searchValue={searchValue}
                            additionalProps={{ style: { paddingBottom: 0 } }}
                            style={{
                              paddingLeft: '10px',
                            }}
                            headerStyle={{ fontSize: '14px' }}
                            collapsed={
                              searchValue.length === 0
                                ? !facetsExpandedStatus[facet.field].facets[
                                    componentFacet.field.split('.').pop()
                                  ]
                                : false
                            }
                            setCollapsed={(collapsed: any) =>
                              dispatch(
                                changeFacetNames(
                                  facet.field,
                                  componentFacet.field.split('.').pop(),
                                  !collapsed
                                )
                              )}
                            category={facet.field}
                          />,
                          <div key={componentFacet.description}>
                            {searchValue.length > 0 ? (
                              <ResultHighlights
                                item={{
                                  description: componentFacet.description,
                                }}
                                query={searchValue}
                                heighlightStyle={{ backgroundColor: '#FFFF00' }}
                                style={{
                                  fontStyle: 'italic',
                                  paddingLeft: '30px',
                                  paddingRight: '10px',
                                }}
                              />
                            ) : null}
                          </div>,
                        ];
                      })}
                    {filteredFacets[facet.field].length > 5 && (
                      <BottomRow style={{ marginRight: '1rem' }}>
                        <ToggleMoreLink
                          onClick={() =>
                            dispatch(showingMoreByCategory(facet.field))}
                        >
                          {facetsExpandedStatus[facet.field].showingMore
                            ? 'Less...'
                            : filteredFacets[facet.field].length - 5 &&
                              `${filteredFacets[facet.field].length -
                                5} More...`}
                        </ToggleMoreLink>
                      </BottomRow>
                    )}
                  </Column>
                )}
              </div>
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
