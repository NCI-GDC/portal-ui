/* @flow */

import React from 'react';
import _ from 'lodash';

import {
  compose,
  defaultProps,
  renameProps,
  setDisplayName,
  withState,
} from 'recompose';

import { withTheme } from '@ncigdc/theme';

import TermAggregation from '@ncigdc/components/Aggregations/TermAggregation';
import DateFacet from '@ncigdc/components/Aggregations/DateFacet';
import RangeFacet from '@ncigdc/components/Aggregations/RangeFacet';
import ExactMatchFacet from '@ncigdc/components/Aggregations/ExactMatchFacet';
import styled from '@ncigdc/theme/styled';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';

const COMMON_PREPOSITIONS = [
  'a',
  'an',
  'and',
  'at',
  'but',
  'by',
  'for',
  'in',
  'nor',
  'of',
  'on',
  'or',
  'out',
  'so',
  'the',
  'to',
  'up',
  'yet',
];

const fieldNameToTitle = fieldName => fieldName
  .replace(/_|\./g, ' ')
  .split(' ')
  .map(
    word => (COMMON_PREPOSITIONS.includes(word) ? word : _.capitalize(word)),
  )
  .join(' ');

const getFacetType = facet => {
  if (_.includes(facet.field, 'datetime')) {
    return 'datetime';
  } if (facet.type === 'terms') {
    // on Annotations & Repo pages project_id is a terms facet
    // need a way to force an *_id field to return terms
    return 'terms';
  } if (facet.type === 'exact') {
    return 'exact';
  } if (
    _.some([
      '_id',
      '_uuid',
      'md5sum',
      'file_name',
    ], idSuffix => _.includes(facet.field, idSuffix))
  ) {
    return 'exact';
  } if (facet.type === 'long' || facet.type === 'float') {
    return 'range';
  }
  return 'terms';
};

const FacetWrapperDiv = styled.div({
  position: 'relative',
});
export const WrapperComponent = compose(withTheme)(({
  setShowingValueSearch,
  showingValueSearch,
  collapsed,
  isMatchingSearchValue,
  setCollapsed,
  facet,
  title,
  aggregation = { buckets: [] },
  handleRequestRemove,
  style,
  headerStyle,
  isRemovable,
  additionalProps,
  maxShowing = 5,
  searchValue,
  category,
  dispatch,
  expandedAll,
  DescriptionComponent = null,
  theme
}: any) => {
  const facetType = getFacetType(facet);
  const displayTitle = title || fieldNameToTitle(facet.field);
  const commonProps = {
    collapsed,
    style,
    title: displayTitle,
  };

  const facetComponent = {
    exact: () => (
      <ExactMatchFacet
        {...commonProps}
        doctype={facet.doc_type}
        fieldNoDoctype={facet.field}
        placeholder={
          facet.placeholder ? facet.placeholder : `Enter ${commonProps.title}`
        }
        {...additionalProps}
        />
    ),
    datetime: () => (
      <DateFacet field={facet.full} {...commonProps} {...additionalProps} />
    ),
    range: () => (
      <RangeFacet
        convertDays={false}
        field={facet.full}
        max={(aggregation.stats || { max: 0 }).max}
        min={(aggregation.stats || { min: 0 }).min}
        {...commonProps}
        {...additionalProps}
        />
    ),
    terms: () => (
      <TermAggregation
        field={facet.full}
        {...commonProps}
        buckets={(aggregation || { buckets: [] }).buckets}
        isMatchingSearchValue={isMatchingSearchValue}
        maxShowing={maxShowing}
        searchValue={searchValue}
        showingValueSearch={showingValueSearch}
        {...additionalProps}
        />
    ),
  }[facetType]();
  const hasValueSearch =
    facetType === 'terms' &&
    (aggregation || { buckets: [] }).buckets.filter(b => b.key !== '_missing')
      .length >= 20;

  return (
    <FacetWrapperDiv className="test-facet" style={{...style, borderTop: `1px solid ${theme.greyScale5}` }}>
      <FacetHeader
        collapsed={collapsed}
        DescriptionComponent={
          DescriptionComponent &&
          !searchValue &&
          (facet.description || 'No description available')
        }
        field={facet.full}
        handleRequestRemove={handleRequestRemove}
        hasValueSearch={!DescriptionComponent && hasValueSearch}
        isRemovable={isRemovable}
        searchValue={searchValue}
        setCollapsed={setCollapsed}
        setShowingValueSearch={setShowingValueSearch}
        showingValueSearch={showingValueSearch}
        style={headerStyle}
        title={displayTitle}
        />
      {searchValue && DescriptionComponent}
      <div>{facetComponent}</div>
    </FacetWrapperDiv>
  );
});
const FacetWrapper = compose(
  setDisplayName('EnhancedFacetWrapper'),
  defaultProps({
    onRequestRemove: _.noop,
    isRemovable: false,
  }),
  renameProps({
    onRequestRemove: 'handleRequestRemove',
  }),
  withState('showingValueSearch', 'setShowingValueSearch', false),
  withState('collapsed', 'setCollapsed', props => props.collapsed),
)(WrapperComponent);

export default FacetWrapper
