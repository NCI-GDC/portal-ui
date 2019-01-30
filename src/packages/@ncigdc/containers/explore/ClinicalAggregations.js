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
} from 'recompose';
import { fetchApi } from '@ncigdc/utils/ajax';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
// import styled from '@ncigdc/theme/styled';
import { withTheme } from '@ncigdc/theme';
import { UploadCaseSet } from '@ncigdc/components/Modals/UploadSet';

import escapeForRelay from '@ncigdc/utils/escapeForRelay';
import RecursiveToggledFacet, { NestedWrapper } from './RecursiveToggledFacet';
import { CaseAggregationsQuery } from './explore.relay';
import SuggestionFacet from '@ncigdc/components/Aggregations/SuggestionFacet';
import UploadSetButton from '@ncigdc/components/UploadSetButton';

const facetMatchesQuery = (facet: any, query: any) =>
  _.some([facet.field, facet.description].map(_.toLower), searchTarget =>
    _.includes(searchTarget, query)
  );

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

const enhance = compose(
  withState('facetMapping', 'setFacetMapping', {}),
  withState('isLoadingFacetMapping', 'setIsLoadingFacetMapping', false),
  withState('fieldHash', 'setFieldHash', {}),
  withState('caseIdCollapsed', 'setCaseIdCollapsed', false),
  withState('toggledTree', 'setToggledTree', {
    cases: { toggled: false },
    demographic: { toggled: false },
    diagnoses: { toggled: false },
    treatments: { toggled: false },
    exposures: { toggled: false },
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
      ...advancedPresetFacets.map(facet => {
        return (
          <NestedWrapper
            key={facet.title + 'NestedWrapper'}
            style={{
              borderBottom: `1px solid ${props.theme.greyScale5}`,
              position: 'relative',
            }}
            headerStyle={{
              backgroundColor: '#eeeeee',
              borderBottom: `1px solid ${props.theme.greyScale5}`,
              position: 'relative',
            }}
            Component={
              // facet.children ? (
              //   facet.children.map(subFacet => {
              //     const subTree = _.get(fieldHash, subFacet.full, {});
              //     if (Object.keys(subTree).includes('description')) {
              //       return (
              //         <FacetWrapper
              //           relayVarName="exploreCaseCustomFacetFields"
              //           key={subFacet.full}
              //           facet={subFacet}
              //           title={subFacet.title.split('.').pop()}
              //           aggregation={
              //             props.aggregations[escapeForRelay(subFacet.field)]
              //           }
              //           relay={props.relay}
              //           // additionalProps={subFacet.additionalProps}
              //           style={{
              //             borderBottom: `1px solid ${props.theme.greyScale5}`,
              //             position: 'relative',
              //           }}
              //           collapsed={true}
              //           maxNum={5}
              //         />
              //       );
              //     } else {
              //       return (
              //         <NestedWrapper
              //           style={{
              //             border: `1px solid ${props.theme.greyScale5}`,
              //             position: 'relative',
              //           }}
              //           Component={
              //             <RecursiveToggledFacet
              //               hash={_.omit(subTree, subFacet.excluded)}
              //               Component={leafFacet => (
              //                 <FacetWrapper
              //                   relayVarName="exploreCaseCustomFacetFields"
              //                   key={leafFacet.full}
              //                   facet={leafFacet}
              //                   title={leafFacet.full.split('.').pop()}
              //                   aggregation={
              //                     props.aggregations[
              //                       escapeForRelay(leafFacet.field)
              //                     ]
              //                   }
              //                   maxNum={Infinity}
              //                   // collapsed={true}
              //                   relay={props.relay}
              //                   style={{
              //                     // borderBottom: `1px solid ${props.theme
              //                     //   .greyScale5}`,
              //                     position: 'relative',
              //                     paddingLeft: '10px',
              //                   }}
              //                 />
              //               )}
              //               key={subFacet.title + 'RecursiveToggledBox'}
              //             />
              //           }
              //           title={subFacet.title}
              //           key={subFacet.full + 'NestedWrapper'}
              //           isCollapsed={_.get(
              //             props.toggledTree[facet.field][subFacet.field],
              //             'toggled',
              //             true
              //           )}
              //           setCollapsed={() =>
              //             props.setToggledTree({
              //               ...props.toggledTree,
              //               [facet.field]: {
              //                 ...props.toggledTree[facet.field],
              //                 [subFacet.field]: {
              //                   toggled: !_.get(
              //                     props.toggledTree[facet.field][
              //                       subFacet.field
              //                     ],
              //                     'toggled',
              //                     true
              //                   ),
              //                 },
              //               },
              //             })}
              //         />
              //       );
              //     }
              //   })
              // ) :
              <RecursiveToggledFacet
                hash={_.omit(_.get(fieldHash, facet.full, {}), facet.excluded)}
                Component={facet => (
                  <FacetWrapper
                    relayVarName="exploreCaseCustomFacetFields"
                    key={facet.full}
                    facet={facet}
                    title={_.startCase(facet.full.split('.').pop())}
                    aggregation={
                      props.aggregations[escapeForRelay(facet.field)]
                    }
                    relay={props.relay}
                    additionalProps={{ style: { padding: 0 } }}
                    style={{
                      // borderBottom: `1px solid ${props.theme.greyScale5}`,
                      position: 'relative',
                      paddingLeft: '10px',
                    }}
                    headerStyle={{ fontSize: '15px' }}
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
