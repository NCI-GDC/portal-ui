import React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';

import Heading from '@ncigdc/uikit/Heading';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import CurrentFilters from '@ncigdc/components/CurrentFilters';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { withTheme } from '@ncigdc/theme';
import ExactMatchFacet from '@ncigdc/components/Aggregations/ExactMatchFacet';
import {
  ShowMoreLink,
  withShowMore,
} from '@ncigdc/components/Pagination/ShowMore';
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

const ShowMoreLinkAsButton = styled(ShowMoreLink, {
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
  connect(({ backLocation }) => ({ backLocation })),
  withTheme,
  withState('showSearchInput', 'setShowSearchInput', false),
  lifecycle({
    componentDidMount(): void {
      if (
        JSON.stringify(this.props.query.filters || {}).includes(
          'cases.submitter_id',
        )
      ) {
        this.props.setShowSearchInput(true);
      }
    },
  }),
  withShowMore({
    pathToData: 'viewer.repository',
    itemExtractor: caseExtractor,
    offsetPrefix: 'cases',
  }),
)(
  ({
    loadedItems,
    query,
    viewer: { repository },
    backLocation,
    variables,
    theme,
    setShowSearchInput,
    showSearchInput,
  }) => {
    const cases = loadedItems;
    const caseId = query.caseId || '';
    const currentIndex = cases.findIndex(c => c.case_id === caseId);
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
                backLocation.search && backLocation.search.includes('bioId')
                  ? 'biospecimen'
                  : null
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
                  {loadedItems.length < repository.cases.hits.total && (
                    <ShowMoreLinkAsButton
                      prefix="cases"
                      offset={variables.cases_offset}
                      size={10}
                    />
                  )}
                  <div>
                    Showing <b>{loadedItems.length}</b> of{' '}
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
