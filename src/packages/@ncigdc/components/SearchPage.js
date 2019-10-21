// @flow

import React from 'react';
import {
  compose,
  setDisplayName,
  withState,
} from 'recompose';

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
  flex: 'none',
  marginRight: '18px',
  width: ({ theme }) => theme.facetsPanelWidth,
});

const Content = styled(Column, {
  flex: 1,
  width: 0,
});

const ShowFacetsButton = styled.button({
  backgroundColor: ({ theme }) => theme.white,
  border: ({ theme }) => `1px solid ${theme.greyScale4}`,
  borderLeft: 'none',
  borderRadius: '0 0.4rem 0.4rem 0',
  flex: 'none',
  margin: `2.1rem 4rem auto -${sidePadding}`,
  outline: 'none',
  padding: 10,
});

type TProps = {
  facetTabs?: Array<Object>,
  results?: mixed,
  showFacets: boolean,
  setShowFacets: Function,
  showRepositoryQuery: boolean,
};

const enhance = compose(
  setDisplayName('EnhancedSearchPage'),
  withState('showFacets', 'setShowFacets', true)
);

const SearchPage = (
  {
    className,
    facetTabs = [],
    results = <span />,
    showFacets,
    setShowFacets,
    filtersLinkProps,
  }: TProps = {},
) => (
  <Container className={`${className} test-search-page`}>
    {showFacets && (
      <FacetsPanel>
        <TabbedLinks
          defaultIndex={0}
          hideTabs={facetTabs.length <= 1}
          links={facetTabs}
          linkStyle={{
            paddingLeft: '1.2rem',
            paddingRight: '1.2rem',
          }}
          queryParam="facetTab"
          tabToolbar={(
            <UnstyledButton
              aria-label="Toggle Facet Panel Visibility"
              onClick={() => {
                setShowFacets(!showFacets);
              }}
              style={{ minHeight: 46 }}
              >
              <DoubleArrowLeftIcon />
            </UnstyledButton>
          )}
          />
      </FacetsPanel>
    )}
    <Content>
      <Row style={{ marginBottom: '2rem' }}>
        {showFacets || (
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
