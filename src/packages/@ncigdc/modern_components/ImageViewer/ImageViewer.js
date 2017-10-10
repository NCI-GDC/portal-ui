import React from 'react';
import { compose, lifecycle, withState } from 'recompose';

import Heading from '@ncigdc/uikit/Heading';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import CurrentFilters from '@ncigdc/components/CurrentFilters';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { withTheme } from '@ncigdc/theme';
import ExactMatchFacet from '@ncigdc/components/Aggregations/ExactMatchFacet';
import withRouter from '@ncigdc/utils/withRouter';
import { parseJSONParam } from '@ncigdc/utils/uri';
import { isEqual } from 'lodash';
import Link from '@ncigdc/components/Links/Link';
import InternalLink from '@ncigdc/components/Links/InternalLink';
import styled from '@ncigdc/theme/styled';
import { linkButton } from '@ncigdc/theme/mixins';
import SearchIcon from '@ncigdc/theme/icons/SearchIcon';

import ImageViewerTab from './ImageViewerTab';

export const getSlides = caseNode => {
  const portions = (caseNode.samples || {
    hits: { edges: [] },
  }).hits.edges.reduce(
    (acc, { node }) => [...acc, ...node.portions.hits.edges.map(p => p.node)],
    [],
  );
  const slides = portions.reduce(
    (acc, { slides }) => [...acc, ...slides.hits.edges.map(p => p.node)],
    [],
  );
  return slides;
};

const LinkAsButton = styled(Link, {
  padding: '6px 6px',
  textAlign: 'center',
  ...linkButton,
});

const InternalLinkAsButton = styled(InternalLink, {
  padding: '6px 6px',
  ...linkButton,
});

const MagnifyingGlass = styled(SearchIcon, {
  padding: '0 1rem',
  ':hover::before': {
    textShadow: ({ theme }) => theme.textShadow,
  },
});

const caseExtractor = repo =>
  (repo.cases.hits || {
    edges: [],
  }).edges.map(({ node }) => node);

export default compose(
  withRouter,
  withTheme,
  withState('loadedCases', 'setLoadedCases', []),
  withState('shouldLoadCases', 'setShouldLoadCases', false),
  withState('showSearchInput', 'setShowSearchInput', false),
  lifecycle({
    componentDidMount(): void {
      const cases = caseExtractor(this.props.viewer.repository);
      this.props.setLoadedCases(cases);
      if (
        JSON.stringify(this.props.query.filters || {}).includes(
          'cases.submitter_id',
        )
      ) {
        this.props.setShowSearchInput(true);
      }
    },
    componentWillReceiveProps(nextProps): void {
      if (
        this.props.shouldLoadCases &&
        !isEqual(nextProps.viewer, this.props.viewer)
      ) {
        const cases = caseExtractor(nextProps.viewer.repository);
        this.props.setLoadedCases([...this.props.loadedCases, ...cases]);
        this.props.setShouldLoadCases(false);
      } else if (
        !isEqual(
          nextProps.variables.cases_offset,
          this.props.variables.cases_offset,
        ) &&
        isEqual(nextProps.variables.filters, this.props.variables.filters)
      ) {
        this.props.setShouldLoadCases(true);
      } else if (!isEqual(this.props.query.filters, nextProps.query.filters)) {
        this.props.setShouldLoadCases(true);
        this.props.setLoadedCases([]);
      }
    },
  }),
)(
  ({
    query,
    loadedCases,
    viewer: { repository },
    history,
    variables,
    theme,
    setShowSearchInput,
    showSearchInput,
  }) => {
    const cases = loadedCases;
    const caseId = query.caseId || '';
    const currentIndex = cases.findIndex(c => c.case_id === caseId);
    const backLocation = parseJSONParam(query.backLocation);
    return (
      <div style={{ padding: '0 1rem' }}>
        <Heading
          style={{
            justifyContent: 'space-between',
            fontSize: '2rem',
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          Slide Image Viewer
          {backLocation && (
            <InternalLinkAsButton
              pathname={backLocation.pathname}
              search={backLocation.search}
              deepLink={
                backLocation.search.includes('bioId') ? 'biospecimen' : null
              }
            >
              Back
            </InternalLinkAsButton>
          )}
        </Heading>
        {query.filters && (
          <CurrentFilters
            style={{ flex: 1, padding: '1rem' }}
            hideHelpText
            hideClearButton
          />
        )}
        {repository.cases.hits.total > 0 ? (
          <div
            style={{
              padding: '0 1rem 1rem 1rem',
              margin: '0.5rem 0 1rem 0',
              backgroundColor: theme.white,
              border: `1px solid ${theme.greyScale4}`,
            }}
          >
            <Row style={{ padding: '0 1rem' }}>
              <h3 style={{ width: '180px', margin: '0.5rem 0' }}>
                Cases
                <MagnifyingGlass
                  onClick={() => setShowSearchInput(!showSearchInput)}
                />
              </h3>
              <h3 style={{ width: '240px', margin: '0.5rem 0' }}>Slides</h3>
              <h3 style={{ margin: '0.5rem 0' }}>Image</h3>
            </Row>
            {showSearchInput && (
              <Row style={{ width: '200px' }}>
                <ExactMatchFacet
                  fieldNoDoctype="submitter_id"
                  doctype="cases"
                  placeholder="eg. TCGA-DD*, *DD*, TCGA-DD-AAVP"
                />
              </Row>
            )}
            <TabbedLinks
              side
              style={{ padding: '0 1rem' }}
              queryParam="caseId"
              defaultIndex={Math.max(currentIndex, 0)}
              linkStyle={{
                width: '100%',
                minWidth: '180px',
              }}
              links={cases.map(caseNode => ({
                key: caseNode.case_id,
                id: caseNode.case_id,
                text: (
                  <div style={{ fontSize: '1rem' }}>
                    {`${caseNode.submitter_id} - ${caseNode.project
                      .project_id}`}
                  </div>
                ),
                component: <ImageViewerTab slides={getSlides(caseNode)} />,
                merge: false,
              }))}
              tabToolbar={
                <Column style={{ alignSelf: 'center', paddingTop: '1rem' }}>
                  {loadedCases.length < repository.cases.hits.total && (
                    <LinkAsButton
                      query={{
                        cases_offset: variables.cases_offset + 10,
                        cases_size: 10,
                      }}
                      merge
                    >
                      Show more
                    </LinkAsButton>
                  )}
                  <div>
                    Showing <b>{loadedCases.length}</b> of{' '}
                    <b>{repository.cases.hits.total}</b>
                  </div>
                </Column>
              }
            />
          </div>
        ) : (
          <Row style={{ padding: '1rem' }}>
            {' '}
            No cases with slides for this filter (note: only TCGA-BRCA cases
            have images in this demo)
          </Row>
        )}
      </div>
    );
  },
);
