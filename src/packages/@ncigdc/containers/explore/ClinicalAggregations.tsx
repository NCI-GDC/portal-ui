import React from 'react';
import Relay from 'react-relay/classic';
import { connect } from 'react-redux';
import {
  every,
  filter,
  get,
  includes,
  mapValues,
  omitBy,
  orderBy,
  replace,
  some,
  startCase,
  toLower,
  values,
} from 'lodash';
import {
  compose,
  withState,
  withProps,
  withHandlers,
  withPropsOnChange,
} from 'recompose';
import { Column, Row } from '@ncigdc/uikit/Flex';
import {
  addAllFacets,
  changeExpandedStatus,
  expandOneCategory,
  showingMoreByCategory,
  IExpandedStatusStateProps,
  IExpandedStatusActionProps,
} from '@ncigdc/dux/facetsExpandedStatus';
import { WrapperComponent } from '@ncigdc/components/FacetWrapper';
import { withTheme } from '@ncigdc/theme';
import { CaseAggregationsQuery } from '@ncigdc/containers/explore/explore.relay';
import { internalHighlight } from '@ncigdc/uikit/Highlight';

import SearchIcon from 'react-icons/lib/fa/search';

import styled from '@ncigdc/theme/styled';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import withFacetSelection from '@ncigdc/utils/withFacetSelection';
import {
  clinicalFacets,
  customSorting,
  presetFacets,
} from '@ncigdc/containers/explore/presetFacets';
import Input from '@ncigdc/uikit/Form/Input';
import { ITheme } from '@ncigdc/theme/types';
import AngleIcon from '@ncigdc/theme/icons/AngleIcon';
import {
  ToggleMoreLink,
  BottomRow,
} from '@ncigdc/components/Aggregations/TermAggregation';

export interface IFacetProps {
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

interface IAggregationProps {
  buckets?: IBucketProps[],
  count?: number,
  stats?: { count: number, [x: string]: number },
}
interface IParsedFacetsProps {
  [x: string]: IAggregationProps,
}
export interface IfilterdFacetsProps {
  [x: string]: IFacetProps[],
}
interface INotificationProps {
  components: string[],
  level: string,
  id: string,
  dismissible: boolean,
  message: JSX.Element,
  dismissed?: boolean,
}
interface IClinicalProps {
  filteredFacets: IfilterdFacetsProps,
  theme: ITheme,
  setUselessFacetVisibility: (uselessFacetVisibility: boolean) => void,
  shouldHideUselessFacets: boolean,
  searchValue: string,
  setSearchValue: (searchValue: string) => void,
  handleQueryInputChange: () => void,
  parsedFacets: IParsedFacetsProps | {},
  isLoadingParsedFacets: boolean,
  allExpanded: { [x: string]: boolean },
  facetsExpandedStatus: IExpandedStatusStateProps,
  dispatch: (action: IExpandedStatusActionProps) => void,
  notifications: INotificationProps[],
  maxHeight: number,
}

interface ICaseFacetsProps {
  __dataID__: string,
  name: string,
  fields: IGraphFieldProps[],
}

interface IGraphFieldProps {
  __dataID__: string,
  name: string,
  description: string,
  type: {
    name: string,
    __dataID__: string,
    fields: IFieldProps[],
  },
}

interface IFieldProps {
  __dataID: string,
  name: string,
  description: string,
  type: { name: string, __dataID: string },
}
const facetMatchesQuery = (
  facet: IFacetProps,
  elements: IBucketProps[],
  searchValue: string,
): boolean => {
  return some(
    [
      replace(facet.field.split('.').pop() || '', /_/g, ' '),
      ...(elements || []).map((e: IBucketProps) => e.key),
      facet.description,
    ]
      .filter((n: string) => n)
      .map(toLower),
    searchTarget => includes(
      searchTarget.toLocaleLowerCase(),
      searchValue.toLocaleLowerCase(),
    ),
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

const enhance = compose(
  connect(
    ({
      facetsExpandedStatus,
      bannerNotification,
    }: {
      facetsExpandedStatus: IExpandedStatusStateProps,
      bannerNotification: INotificationProps[],
    }) => ({
      facetsExpandedStatus,
      notifications: bannerNotification,
      allExpanded: mapValues(facetsExpandedStatus, status => some(values(status.facets))),
    }),
  ),
  withState('isLoadingParsedFacets', 'setIsLoadingParsedFacets', false),
  withState('shouldHideUselessFacets', 'setShouldHideUselessFacets', true),
  withState('searchValue', 'setSearchValue', ''),
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
    ({ caseFacets }: { caseFacets: ICaseFacetsProps }) => ({
      facetMapping: caseFacets.fields
        .filter((f: IGraphFieldProps): boolean => f.name === 'aggregations')[0]
        .type.fields.filter((f: IFieldProps) => !f.name.startsWith('gene'))
        .reduce(
          (acc: { [x: string]: IFacetProps } | {}, f: IFieldProps) => ({
            ...acc,
            [`cases.${f.name.replace(/__/g, '.')}`]: {
              field: f.name.replace(/__/g, '.'),
              full: `cases.${f.name.replace(/__/g, '.')}`,
              doc_type: 'cases',
              description: f.description,
              type: f.type.name === 'Aggregations' ? 'keyword' : 'long',
            },
          }),
          {},
        ),
    }),
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
          [relayVarName]: values(facetMapping)
            .map(({ field }: { field: string }) => field)
            .join(','),
        },
        (readyState: { ready: boolean, aborted: boolean, error: boolean }) => {
          if (
            some([
              readyState.ready,
              readyState.aborted,
              readyState.error,
            ])
          ) {
            setIsLoadingParsedFacets(false);
          }
        },
      );
    },
  ),
  withProps(
    ({
      setShouldHideUselessFacets,
    }) => ({
      setUselessFacetVisibility: (shouldHide: boolean) => {
        setShouldHideUselessFacets(shouldHide);
        localStorage.setItem(
          'shouldHideUselessFacets',
          JSON.stringify(shouldHide),
        );
      },
    }),
  ),
  withPropsOnChange(
    [
      'facets',
      'facetMapping',
      'searchValue',
      'shouldHideUselessFacets',
    ],
    ({
      facets,
      facetMapping,
      searchValue,
      shouldHideUselessFacets,
      facetExclusionTest,
      dispatch,
    }) => {
      const parsedFacets: IParsedFacetsProps | {} = facets.facets
        ? tryParseJSON(facets.facets, {})
        : {};

      const usefulFacets = omitBy(
        parsedFacets,
        (aggregation: IAggregationProps) => some([
          !aggregation,
          aggregation.buckets &&
          aggregation.buckets.filter(
            (bucket: IBucketProps) => bucket.key !== '_missing',
          ).length === 0,
          aggregation.count === 0,
          aggregation.count === null,
          aggregation.stats && aggregation.stats.count === 0,
        ]),
      );

      const filteredFacets = clinicalFacets.reduce((acc, header) => {
        return {
          ...acc,
          [header.field]: filter(facetMapping, facet => {
            return every([
              facetMatchesQuery(
                facet,
                filter(
                  get(parsedFacets[facet.field], 'buckets', undefined),
                  obj => obj.key !== '_missing',
                ),
                searchValue,
              ),
              !facetExclusionTest(facet),
              !shouldHideUselessFacets ||
              Object.prototype.hasOwnProperty.call(usefulFacets, facet.field),
              !header.excluded || facet.full.startsWith(header.full),
              !some(
                header.excluded.map((regex: RegExp) => regex.test(facet.full)),
              ),
            ]);
          }),
        };
      }, {});
      dispatch(addAllFacets(filteredFacets));
      return {
        parsedFacets,
        filteredFacets,
      };
    },
  ),
  withHandlers({
    handleQueryInputChange:
      ({ setSearchValue }) => (event: any) => setSearchValue(event.target.value),
  }),
)(
  withTheme(
    ({
      filteredFacets,
      theme,
      setUselessFacetVisibility,
      shouldHideUselessFacets,
      facetsExpandedStatus,
      searchValue,
      handleQueryInputChange,
      parsedFacets,
      isLoadingParsedFacets,
      allExpanded,
      dispatch,
      maxHeight,
    }: IClinicalProps): any => {
      return (
        <React.Fragment>
          <Row
            key="row"
            style={{
              margin: '2.5rem 1rem 0 0.5rem',
            }}
            >
            <MagnifyingGlass />
            <Input
              aria-label="Search..."
              autoFocus
              defaultValue={searchValue}
              onChange={handleQueryInputChange}
              placeholder="Search..."
              style={{
                borderRadius: '0 4px 4px 0',
                marginBottom: '6px',
              }}
              />
          </Row>
          <label key="label">
            <input
              checked={shouldHideUselessFacets}
              className="test-filter-useful-facet"
              onChange={event => setUselessFacetVisibility(event.target.checked)}
              style={{ margin: '12px' }}
              type="checkbox"
              />
            Only show fields with values (
            {isLoadingParsedFacets
              ? '...'
              : values(filteredFacets).reduce(
                (acc: number, facet: IFacetProps[]) => acc + facet.length,
                0,
              )}
            {' '}
            fields shown)
          </label>
          <div
            className="cohortBuilder"
            key="1"
            style={{
              overflowY: 'scroll',
              maxHeight: `${maxHeight - 44}px`,
              paddingBottom: '20px',
            }}
            >
            {clinicalFacets
              .filter(
                facet => !searchValue || filteredFacets[facet.field].length > 0,
                // If the user is searching for something, hide the presetFacet with no value.
              )
              .map(facet => {
                return (
                  <div key={`${facet.title}div`}>
                    <Row
                      style={{
                        position: 'sticky',
                        top: 0,
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
                        onClick={() => dispatch(changeExpandedStatus(facet.field, ''))}
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
                            transform: `rotate(${facetsExpandedStatus[
                              facet.field
                            ].expanded
                              ? 0
                              : 270}deg)`,
                          }}
                          />
                        {facet.title}
                      </div>
                      {facetsExpandedStatus[facet.field].expanded && (
                        <span
                          onClick={() => {
                            dispatch(
                              expandOneCategory(
                                facet.field,
                                !allExpanded[facet.field],
                              ),
                            );
                          }}
                          style={{
                            display: 'flex',
                            float: 'right',
                            fontSize: '12px',
                          }}
                          >
                          {searchValue ||
                            filteredFacets[facet.field].length === 0
                            ? null
                            : allExpanded[facet.field]
                              ? 'Collapse All'
                              : 'Expand All'}
                        </span>
                      )}
                    </Row>
                    {facetsExpandedStatus[facet.field].expanded && (
                      <Column>
                        {filteredFacets[facet.field].length > 0
                          ? (
                            orderBy(
                              filteredFacets[facet.field],
                              ['field'],
                              ['asc'],
                            )
                              .slice(
                                0,
                                facetsExpandedStatus[facet.field].showingMore
                                  ? Infinity
                                  : 5,
                              )
                              .map((componentFacet: IFacetProps) => {
                                const fieldName =
                                  componentFacet.full.split('.').pop() || '';
                                return [
                                  <WrapperComponent
                                    additionalProps={{
                                      style: { paddingBottom: 0 },
                                    }}
                                    aggregation={parsedFacets[componentFacet.field]}
                                    allExpanded={allExpanded[facet.field]}
                                    category={facet.field}
                                    collapsed={
                                      searchValue.length === 0
                                        ? !facetsExpandedStatus[facet.field].facets[
                                          fieldName
                                        ]
                                        : false
                                    }
                                    DescriptionComponent={(
                                      <div
                                        key={componentFacet.description}
                                        style={{
                                          fontStyle: 'italic',
                                          paddingLeft: '30px',
                                          paddingRight: '10px',
                                          width: '320px',
                                        }}
                                        >
                                        {internalHighlight(
                                          searchValue,
                                          componentFacet.description,
                                          {
                                            backgroundColor: '#FFFF00',
                                          },
                                        )}
                                      </div>
                                    )}
                                    facet={componentFacet}
                                    headerStyle={{
                                      padding: '0.5rem 1.2rem 0.5rem 1.2rem',
                                      fontSize: '16px',
                                    }}
                                    isMatchingSearchValue={(componentFacet.full +
                                      componentFacet.description
                                    )
                                      .toLocaleLowerCase()
                                      .includes(searchValue.toLocaleLowerCase())}
                                    key={componentFacet.full}
                                    relayVarName="exploreCaseCustomFacetFields"
                                    searchValue={searchValue}
                                    setCollapsed={() => dispatch(
                                      changeExpandedStatus(
                                        facet.field,
                                        fieldName,
                                      ),
                                    )}
                                    style={{
                                      order: customSorting[componentFacet.field] || 0,
                                      paddingLeft: '10px',
                                    }}
                                    title={startCase(fieldName)}
                                    />,
                                ];
                              }))
                          : (
                            <article
                              style={{
                                fontSize: '1.7rem',
                                padding: '2rem 3rem',
                              }}
                              >
                              No data is available for this clinical category.
                            </article>
                          )}

                        {filteredFacets[facet.field].length > 5 && (
                          <BottomRow style={{ marginRight: '1rem' }}>
                            <ToggleMoreLink
                              onClick={() => dispatch(showingMoreByCategory(facet.field))}
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
              })}
          </div>
        </React.Fragment>
      );
    },
  ),
);

const ClinicalAggregations = Relay.createContainer(
  enhance,
  CaseAggregationsQuery,
);
export default ClinicalAggregations;
