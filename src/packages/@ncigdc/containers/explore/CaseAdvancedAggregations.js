/* @flow */

import React from 'react';
import _ from 'lodash';
// import { css } from 'glamor';
import {
  compose,
  withState,
  lifecycle,
  withProps,
  // renameProps,
  defaultProps,
  withHandlers,
} from 'recompose';
import { fetchApi } from '@ncigdc/utils/ajax';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import styled from '@ncigdc/theme/styled';

// import entityShortnameMapping from '@ncigdc/utils/entityShortnameMapping';
// import Highlight from '@ncigdc/uikit/Highlight';
// import withSelectableList from '@ncigdc/utils/withSelectableList';
// import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
const facetMatchesQuery = (facet: any, query: any) =>
  _.some([facet.field, facet.description].map(_.toLower), searchTarget =>
    _.includes(searchTarget, query)
  );
const FacetWrapperDiv = styled.div({
  position: 'relative',
  paddingLeft: '10px',
});
const nestedWrapper = (Component, title, isCollapsed, setCollapsed) => (
  <FacetWrapperDiv key={title + 'div'}>
    <FacetHeader
      title={title}
      collapsed={isCollapsed}
      setCollapsed={setCollapsed}
      key={title}
    />
    {isCollapsed || Component}
  </FacetWrapperDiv>
);

const advancedPresetFacets = [
  {
    title: 'Case',
    field: 'cases',
    children: [
      {
        title: 'Primary Site',
        field: 'primary_site',
        full: 'cases.primary_site',
      },
      {
        title: 'Program',
        field: 'program',
        full: 'cases.project.program',
      },
      {
        title: 'Project',
        field: 'project',
        full: 'cases.project',
      },
      {
        title: 'Disease Type',
        field: 'disease_type',
        full: 'cases.disease_type',
      },
    ],
  },
  {
    title: 'Demographic',
    field: 'demographic',
    full: 'cases.demographic',
  },
  {
    title: 'Diagnoses',
    field: 'diagnoses',
    full: 'cases.diagnoses',
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

export default compose(
  withState('facetMapping', 'setFacetMapping', {}),
  withState('isLoadingFacetMapping', 'setIsLoadingFacetMapping', false),
  withState('fieldHash', 'setFieldHash', {}),
  withState('toggledTree', 'setToggledTree', {
    cases: { toggled: false },
    demographic: { toggled: true },
    diagnoses: { toggled: true },
    treatments: { toggled: true },
    exposures: { toggled: true },
    follow_up: { toggled: false },
    molecular_tests: { toggled: false },
  }),
  defaultProps({
    excludeFacetsBy: _.noop,
    onRequestClose: _.noop,
  }),
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
      query,
      shouldHideUselessFacets,
      usefulFacets,
    }) => ({
      filteredFacets: _.filter(_.values(facetMapping), facet =>
        _.every([
          facetMatchesQuery(facet, query),
          !excludeFacetsBy(facet),
          !shouldHideUselessFacets ||
            Object.keys(usefulFacets).includes(facet.field),
        ])
      ),
    })
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
    handleQueryInputChange: ({ setQuery }) => (event: any) =>
      setQuery(event.target.value),
  }),
  lifecycle({
    componentDidMount(): void {
      this.props.fetchData();
    },
  })
)((props: any) => {
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

  const rec = (componentWrapper, hash, toggledTree, setToggledTree, root) => {
    if (!hash) {
      return '';
    }
    if (Object.keys(hash) === 0) {
      return '';
    }
    if (typeof hash !== 'object') {
      return <div style={{ backgroundColor: 'green' }}>{hash}</div>;
    }

    return Object.keys(hash).map(key => {
      toggledTree[key] = { toggled: false };
      return componentWrapper(
        rec(componentWrapper, hash[key], toggledTree[key], setToggledTree),
        key,
        toggledTree.toggled,
        () => setToggledTree(),
        root
      );
    });
  };
  return advancedPresetFacets.map(facet => {
    if (facet.children) {
      return nestedWrapper(
        facet.children.map(sub =>
          nestedWrapper(
            rec(nestedWrapper, _.get(fieldHash, sub.full, {})),
            sub.title
          )
        ),
        facet.title,
        props.toggledTree[facet.field].toggled,
        () =>
          props.setToggledTree({
            ...props.toggledTree,
            [facet.field]: {
              ...props.toggledTree[facet.field],
              toggled: !props.toggledTree[facet.field].toggled,
            },
          })
      );
    } else {
      return nestedWrapper(
        rec(nestedWrapper, _.get(fieldHash, facet.full, {})),
        facet.title,
        props.toggledTree[facet.field].toggled,
        () =>
          props.setToggledTree({
            ...props.toggledTree,
            [facet.field]: {
              ...props.toggledTree[facet.field],
              toggled: !props.toggledTree[facet.field].toggled,
            },
          })
      );
    }
  });
});
