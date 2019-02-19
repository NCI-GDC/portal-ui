// @flow

import React from 'react';
import { compose, withState } from 'recompose';

import { Row, Column } from '@ncigdc/uikit/Flex';
import styled from '@ncigdc/theme/styled';
import CurrentFilters from '@ncigdc/components/CurrentFilters';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import UnstyledButton from '@ncigdc/uikit/UnstyledButton';
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@ncigdc/theme/icons';

const sidePadding = '2.5rem';

const Container = styled(Row, {
  padding: `2rem ${sidePadding} 13rem`,
});

const FacetsPanel = styled(Column, {
  width: ({ theme }) => theme.facetsPanelWidth,
  flex: 'none',
  marginRight: '18px',
});

const Content = styled(Column, {
  flex: 1,
  width: 0,
});

const ShowFacetsButton = styled.button({
  flex: 'none',
  padding: 10,
  backgroundColor: ({ theme }) => theme.white,
  border: ({ theme }) => `1px solid ${theme.greyScale4}`,
  borderLeft: 'none',
  margin: `2.1rem 4rem auto -${sidePadding}`,
  outline: 'none',
  borderRadius: '0 0.4rem 0.4rem 0',
});

type TProps = {
  facetTabs?: Array<Object>,
  results?: mixed,
  showFacets: boolean,
  setShowFacets: Function,
  showRepositoryQuery: boolean,
};

const enhance = compose(withState('showFacets', 'setShowFacets', true));

const SearchPage = (
  {
    facetTabs = [],
    results = <span />,
    showFacets,
    setShowFacets,
    filtersLinkProps,
    ...props
  }: TProps = {}
) => (
  <Container className={props.className + ' test-search-page'}>
    {showFacets && (
      <FacetsPanel>
        <TabbedLinks
          queryParam="facetTab"
          defaultIndex={0}
          tabToolbar={
            <UnstyledButton
              style={{ minHeight: 46 }}
              onClick={() => {
                setShowFacets(!showFacets);
              }}
              aria-label="Toggle Facet Panel Visibility"
            >
              <DoubleArrowLeftIcon />
            </UnstyledButton>
          }
          hideTabs={facetTabs.length <= 1}
          links={facetTabs}
        />
      </FacetsPanel>
    )}
    <Content>
      <Row style={{ marginBottom: '2rem' }}>
        {!showFacets && (
          <ShowFacetsButton onClick={() => setShowFacets(!showFacets)}>
            <DoubleArrowRightIcon />
          </ShowFacetsButton>
        )}
        <CurrentFilters style={{ flex: 1 }} {...filtersLinkProps} />
      </Row>
      {results}
    </Content>
  </Container>
);

export default enhance(SearchPage);
