/* @flow */

import React from 'react';
import _ from 'lodash';

import {
  compose,
  defaultProps,
  renameProps,
  withState,
  lifecycle,
} from 'recompose';

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

const fieldNameToTitle = fieldName =>
  fieldName
    .replace(/_|\./g, ' ')
    .split(' ')
    .map(
      word => (COMMON_PREPOSITIONS.includes(word) ? word : _.capitalize(word))
    )
    .join(' ');

const getFacetType = facet => {
  if (_.includes(facet.field, 'datetime')) {
    return 'datetime';
  } else if (facet.type === 'terms') {
    // on Annotations & Repo pages project_id is a terms facet
    // need a way to force an *_id field to return terms
    return 'terms';
  } else if (facet.type === 'exact') {
    return 'exact';
  } else if (
    _.some(['_id', '_uuid', 'md5sum', 'file_name'], idSuffix =>
      _.includes(facet.field, idSuffix)
    )
  ) {
    return 'exact';
  } else if (facet.type === 'long' || facet.type === 'float') {
    return 'range';
  }
  return 'terms';
};

const FacetWrapperDiv = styled.div({
  position: 'relative',
});
export const WrapperComponent = ({
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
  maxNum = 5,
  searchValue,
  category,
  dispatch,
  expandedAll,
}: any) => {
  const facetType = getFacetType(facet);
  const displayTitle = title || fieldNameToTitle(facet.field);
  const commonProps = {
    style,
    title: displayTitle,
    collapsed,
  };

  const facetComponent = {
    exact: () => (
      <ExactMatchFacet
        {...commonProps}
        fieldNoDoctype={facet.field}
        doctype={facet.doc_type}
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
        field={facet.full}
        convertDays={false}
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
        isMatchingSearchValue={isMatchingSearchValue}
        buckets={(aggregation || { buckets: [] }).buckets}
        searchValue={searchValue}
        showingValueSearch={showingValueSearch}
        maxNum={maxNum}
        {...additionalProps}
      />
    ),
  }[facetType]();
  const hasValueSearch =
    facetType === 'terms' &&
    (aggregation || { buckets: [] }).buckets.filter(b => b.key !== '_missing')
      .length >= 20;

  return (
    <FacetWrapperDiv style={style} className="test-facet">
      <FacetHeader
        title={displayTitle}
        field={facet.full}
        searchValue={searchValue}
        handleRequestRemove={handleRequestRemove}
        isRemovable={isRemovable}
        hasValueSearch={hasValueSearch}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        showingValueSearch={showingValueSearch}
        setShowingValueSearch={setShowingValueSearch}
        style={headerStyle}
      />
      <div style={{ paddingLeft: '10px' }}>{facetComponent}</div>
    </FacetWrapperDiv>
  );
};
const FacetWrapper = compose(
  defaultProps({
    onRequestRemove: _.noop,
    isRemovable: false,
  }),
  renameProps({
    onRequestRemove: 'handleRequestRemove',
  }),
  withState('showingValueSearch', 'setShowingValueSearch', false),
  withState('collapsed', 'setCollapsed', props => props.collapsed)
)(WrapperComponent);

export default FacetWrapper;
