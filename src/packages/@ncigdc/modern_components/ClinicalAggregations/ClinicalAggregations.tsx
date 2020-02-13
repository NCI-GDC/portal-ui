import React from 'react';
import { connect } from 'react-redux';
import {
  every,
  filter,
  get,
  includes,
  isEmpty,
  isEqual,
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
  setDisplayName,
  withHandlers,
  withProps,
  withPropsOnChange,
  withState,
} from 'recompose';
import SearchIcon from 'react-icons/lib/fa/search';

import {
  addAllFacets,
  changeExpandedStatus,
  expandOneCategory,
  showingMoreByCategory,
  IExpandedStatusStateProps,
  IExpandedStatusActionProps,
} from '@ncigdc/dux/facetsExpandedStatus';

import { withTheme } from '@ncigdc/theme';
import withFacetSelection from '@ncigdc/utils/withFacetSelection';
import styled from '@ncigdc/theme/styled';
import termCapitaliser from '@ncigdc/utils/customisation';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import {
  clinicalFacets,
  customSorting,
  presetFacets,
} from '@ncigdc/containers/explore/presetFacets';

import { Column, Row } from '@ncigdc/uikit/Flex';
import { WrapperComponent } from '@ncigdc/components/FacetWrapper';
import { internalHighlight } from '@ncigdc/uikit/Highlight';
import Input from '@ncigdc/uikit/Form/Input';
import AngleIcon from '@ncigdc/theme/icons/AngleIcon';
import {
  ToggleMoreLink,
  BottomRow,
} from '@ncigdc/components/Aggregations/TermAggregation';

import { ITheme } from '@ncigdc/theme/types';
import { IGroupFilter } from '@ncigdc/utils/filters/types'

export interface IFacetProps {
  customSort: number,
  description: string,
  doc_type: string,
  field: string,
  full: string,
  type: string,
  additionalProps?: any,
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

export interface IFilteredFacetsProps {
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
  filteredFacets: IFilteredFacetsProps,
  theme: ITheme,
  setUselessFacetVisibility: (uselessFacetVisibility: boolean) => void,
  shouldHideUselessFacets: boolean,
  searchValue: string,
  setSearchValue: (searchValue: string) => void,
  handleQueryInputChange: () => void,
  handleQueryInputClear: () => void,
  parsedFacets: IParsedFacetsProps | {},
  isLoadingParsedFacets: boolean,
  allExpanded: { [x: string]: boolean },
  facetsExpandedStatus: IExpandedStatusStateProps,
  dispatch: (action: IExpandedStatusActionProps) => void,
  notifications: INotificationProps[],
  maxFacetsPanelHeight: number,
  globalFilters: IGroupFilter,
}

interface IFieldProps {
  __dataID: string,
  customSort: number,
  description: string,
  name: string,
  type: { name: string, __dataID: string },
}

interface IClinicalViewer {
  explore: {
    cases: {
      customCaseFacets: string
    }
  }
}

interface IClinicalQueryProps extends IClinicalProps {
  clinicalAnalysisFields: [IFieldProps],
  variables: {
    viewer: IClinicalViewer
  },
  viewer: IClinicalViewer
}

interface IParsedClinicalAggs extends IClinicalQueryProps {
  facetMapping: IFacetProps,
  facetExclusionTest: (facet: IFacetProps) => IFacetProps
}

const headersHeight = 44;

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
  border: ({ theme }: { theme: ITheme }) => `1px solid ${theme.greyScale4}`,
  borderRadius: '4px 0 0 4px',
  borderRight: 'none',
  color: ({ theme }: { theme: ITheme }) => theme.greyScale2,
  height: '3.4rem',
  padding: '0.8rem',
  width: '3.4rem',
});

const enhance = compose<IClinicalProps, IClinicalProps>(
  setDisplayName('EnhancedClinicalAggregations_Modern'),
  withTheme,
  connect(
    ({
      bannerNotification,
      facetsExpandedStatus,
    }: {
      facetsExpandedStatus: IExpandedStatusStateProps,
      bannerNotification: INotificationProps[],
    }) => ({
      allExpanded: mapValues(facetsExpandedStatus, status => some(values(status.facets))),
      facetsExpandedStatus,
      notifications: bannerNotification,
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
    (props: IClinicalQueryProps, nextProps: IClinicalQueryProps) => !isEqual(props.globalFilters, nextProps.globalFilters),
    ({ clinicalAnalysisFields }) => ({
      facetMapping: clinicalAnalysisFields.reduce((
        acc: { [x: string]: IFacetProps } | {},
        {
          description,
          name,
          type,
        }: IFieldProps
      ) => {
        const dottedName = name.replace(/__/g, '.');
        return ({
          ...acc,
          [`cases.${dottedName}`]: {
            additionalProps: { convertDays: name.includes('age_at_diagnosis') },
            customSort: customSorting(dottedName),
            description,
            doc_type: 'cases',
            field: dottedName,
            full: `cases.${dottedName}`,
            type: type.name === 'Aggregations' ? 'keyword' : 'long',
          },
        });
      }, {}),
    }),
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
  withPropsOnChange((props: IParsedClinicalAggs, nextProps: IParsedClinicalAggs) =>
    !(isEqual(props.facetMapping, nextProps.facetMapping) &&
      isEqual(props.viewer.explore.cases.customCaseFacets, nextProps.viewer.explore.cases.customCaseFacets) &&
      props.shouldHideUselessFacets === nextProps.shouldHideUselessFacets &&
      props.searchValue === nextProps.searchValue),
    ({
      dispatch,
      facetExclusionTest,
      facetMapping,
      searchValue,
      shouldHideUselessFacets,
      viewer: { explore: { cases: { customCaseFacets } } },
    }) => {
      const parsedFacets: IParsedFacetsProps | {} = isEmpty(customCaseFacets)
        ? {}
        : tryParseJSON(customCaseFacets, {});

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
        filteredFacets,
        parsedFacets,
      };
    },
  ),
  withHandlers({
    handleQueryInputChange:
      ({ setSearchValue }) => (event: any) => setSearchValue(event.target.value),
    handleQueryInputClear:
      ({ setSearchValue }) => () => setSearchValue(''),
  }),
);

const ClinicalAggregations = ({
  allExpanded,
  dispatch,
  facetsExpandedStatus,
  filteredFacets,
  handleQueryInputClear,
  handleQueryInputChange,
  isLoadingParsedFacets,
  maxFacetsPanelHeight,
  parsedFacets,
  searchValue,
  setUselessFacetVisibility,
  shouldHideUselessFacets,
  theme,
}: IClinicalProps) => (
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
          handleClear={handleQueryInputClear}
          onChange={handleQueryInputChange}
          placeholder="Search..."
          style={{
            borderRadius: '0 4px 4px 0',
            marginBottom: '6px',
          }}
          value={searchValue}
          />
      </Row>
      <label htmlFor="clinical-agg-search" key="label">
        <input
          checked={shouldHideUselessFacets}
          className="test-filter-useful-facet"
          id="clinical-agg-search"
          onChange={event => setUselessFacetVisibility(event.target.checked)}
          style={{ margin: '12px' }}
          type="checkbox"
          />
        {`Only show fields with values (${
          isLoadingParsedFacets
            ? '...'
            : values(filteredFacets).reduce(
              (acc: number, facet: IFacetProps[]) => acc + facet.length,
              0,
            )
        } fields shown)`}
      </label>
      <div
        className="cohortBuilder"
        key="1"
        style={{
          maxHeight: `${maxFacetsPanelHeight - headersHeight}px`,
          overflowY: 'scroll',
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
                    alignItems: 'center',
                    background: '#eeeeee',
                    cursor: 'pointer',
                    justifyContent: 'space-between',
                    margin: '0.5rem 1rem 0rem 0rem',
                    padding: '1rem 1.2rem 0.5rem 1.2rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
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
                        transform: `rotate(${
                          facetsExpandedStatus[facet.field].expanded
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
                      {(searchValue || filteredFacets[facet.field].length === 0) ||
                        allExpanded[facet.field]
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
                          ['customSort', 'field'],
                        )
                          .slice(
                            0,
                            facetsExpandedStatus[facet.field].showingMore
                              ? Infinity
                              : 5,
                          )
                          .map((componentFacet: IFacetProps) => {
                            const fieldName = componentFacet.full.split('.').pop() || '';
                            return [
                              <WrapperComponent
                                additionalProps={{
                                  ...componentFacet.additionalProps,
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
                                  fontSize: '16px',
                                  padding: '1.2rem',
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
                                style={{ paddingLeft: '10px' }}
                                title={startCase(
                                  termCapitaliser(fieldName)
                                )}
                                />,
                            ];
                          }))
                      : (
                        <article
                          style={{
                            fontSize: '1.5rem',
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

export default enhance(ClinicalAggregations);
