/* @flow */

import React from 'react';
import { compose, defaultProps } from 'recompose';
import { css } from 'glamor';

import { parseFilterParam } from '@ncigdc/utils/uri';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import styled from '@ncigdc/theme/styled';
import { ResultHighlights } from '@ncigdc/components/QuickSearch/QuickSearchResults';

import FacetResetButton from '@ncigdc/components/Aggregations/FacetResetButton';
import CloseIcon from '@ncigdc/theme/icons/CloseIcon';
import SearchIcon from '@ncigdc/theme/icons/SearchIcon';
import AngleIcon from '@ncigdc/theme/icons/AngleIcon';
import QuestionIcon from '@ncigdc/theme/icons/Question';
import { Row } from '@ncigdc/uikit/Flex';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { internalHighlight } from '@ncigdc/uikit/Highlight';
import { IRawQuery } from '@ncigdc/utils/uri/types';

const Header = styled(Row, {
  color: ({ theme }) => theme.primary,
  fontSize: '1.7rem',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 1.2rem 0.5rem 1.2rem',
  backgroundColor: 'white',
});

const IconsRow = styled(Row, {
  color: ({ theme }) => theme.greyScale7,
  lineHeight: '1.48px',
  fontSize: '1.2em',
  ':link': {
    color: ({ theme }) => theme.greyScale7,
  },
  ':visited': {
    color: ({ theme }) => theme.greyScale7,
  },
});

const RemoveIcon = styled(CloseIcon, {
  ':hover::before': {
    textShadow: ({ theme }) => theme.textShadow,
  },
  color: ({ theme }) => theme.greyScale7,
  paddingLeft: '2px',
});

const MagnifyingGlass = styled(SearchIcon, {
  ':hover::before': {
    textShadow: ({ theme }) => theme.textShadow,
  },
});

const FacetHeader = compose(
  defaultProps({
    handleRequestRemove: () => {},
    isRemovable: false,
    hasValueSearch: false,
    setShowingValueSearch: () => {},
  })
)(
  ({
    field,
    title,
    DescriptionComponent,
    description,
    isRemovable,
    handleRequestRemove,
    collapsed,
    setCollapsed,
    showingValueSearch,
    setShowingValueSearch,
    hasValueSearch,
    searchValue,
    style,
    angleIconRight = false,
  }) => (
    <LocationSubscriber>
      {(ctx: { pathname: string, query: IRawQuery }) => {
        const currentFilters =
          ctx.query && parseFilterParam((ctx.query || {}).filters, {});
        let spanStyle = { cursor: 'pointer', whiteSpace: 'nowrap' };
        if (angleIconRight) {
          spanStyle['width'] = '100%';
        }
        return (
          <Header className="test-facet-header" style={style}>
            <Tooltip
              Component={
                DescriptionComponent ? (
                  <div style={{ maxWidth: '24em' }}>{DescriptionComponent}</div>
                ) : null
              }
            >
              <span style={spanStyle} onClick={() => setCollapsed(!collapsed)}>
                {!angleIconRight && (
                  <AngleIcon
                    style={{
                      paddingRight: '0.25rem',
                      transform: `rotate(${collapsed ? 270 : 0}deg)`,
                    }}
                  />
                )}
                {searchValue
                  ? internalHighlight(searchValue, title, {
                      backgroundColor: '#FFFF00',
                    })
                  : title}
                {angleIconRight && (
                  <AngleIcon
                    style={{
                      overflow: 'auto',
                      display: 'flex',
                      float: 'right',
                      transform: `rotate(${collapsed ? 270 : 0}deg)`,
                    }}
                  />
                )}
              </span>
            </Tooltip>
            <IconsRow>
              {description && (
                <Tooltip
                  Component={description}
                  {...css({ ':not(:last-child)': { marginRight: 8 } })}
                >
                  <QuestionIcon />
                </Tooltip>
              )}
              {hasValueSearch && (
                <MagnifyingGlass
                  onClick={() => setShowingValueSearch(!showingValueSearch)}
                />
              )}
              <FacetResetButton field={field} currentFilters={currentFilters} />
              {isRemovable && (
                <RemoveIcon
                  onClick={handleRequestRemove}
                  onKeyPress={event =>
                    event.key === 'Enter' && handleRequestRemove()}
                  role="button"
                  tabIndex="0"
                  aria-label="Close"
                />
              )}
            </IconsRow>
          </Header>
        );
      }}
    </LocationSubscriber>
  )
);
export default FacetHeader;
