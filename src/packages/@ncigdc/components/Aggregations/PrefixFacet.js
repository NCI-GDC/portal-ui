// @flow

// Vendor
import React from 'react';
import { compose, withState, pure } from 'recompose';
import SearchIcon from 'react-icons/lib/fa/search';

// Custom
import { makeFilter } from '@ncigdc/utils/filters';
import { Row, Column } from '@ncigdc/uikit/Flex';
import withDropdown from '@ncigdc/uikit/withDropdown';
import { dropdown } from '@ncigdc/theme/mixins';
import styled from '@ncigdc/theme/styled';
import Link from '@ncigdc/components/Links/Link';
import Hidden from '@ncigdc/components/Hidden';
import Input from '@ncigdc/uikit/Form/Input';

import { Container } from './';

const MagnifyingGlass = styled(SearchIcon, {
  backgroundColor: ({ theme }) => theme.greyScale5,
  color: ({ theme }) => theme.greyScale2,
  padding: '0.8rem',
  width: '3.4rem',
  height: '3.4rem',
  borderRadius: '4px 0 0 4px',
  border: ({ theme }) => `1px solid ${theme.greyScale4}`,
  borderRight: 'none',
});

const StyledDropdownLink = styled(Link, {
  color: ({ theme }) => theme.greyScale2,
  padding: '1rem',
  ':link': {
    textDecoration: 'none',
  },
  ':hover': {
    backgroundColor: 'rgb(31, 72, 108)',
    color: 'white',
    textDecoration: 'none',
  },
  width: '100%',
  textDecoration: 'none',
});

const PrefixFacet = compose(
  withDropdown,
  pure,
  withState('value', 'setValue', ''),
)(
  ({
    doctype,
    fieldNoDoctype,
    placeholder,
    setActive,
    active,
    mouseDownHandler,
    mouseUpHandler,
    value,
    setValue,
    collapsed,
  }) =>
    <Container>
      {!collapsed &&
        <Row>
          <label htmlFor={fieldNoDoctype}>
            <MagnifyingGlass /><Hidden>title</Hidden>
          </label>
          <Input
            style={{ borderRadius: '0 4px 4px 0' }}
            id={fieldNoDoctype}
            name={fieldNoDoctype}
            onChange={e => {
              const v = e.target.value;
              setValue(v);
              setActive(!!v);
            }}
            placeholder={placeholder}
            value={value}
          />
          {active &&
            <Column
              style={{
                ...dropdown,
                marginTop: 0,
                top: '35px',
                minWidth: '290px',
              }}
              onMouseUp={mouseUpHandler}
              onMouseDown={mouseDownHandler}
            >
              <StyledDropdownLink
                merge="toggle"
                query={{
                  filters: makeFilter([
                    {
                      field: `${doctype}.${fieldNoDoctype}`,
                      value: [`${value}*`],
                    },
                  ]),
                }}
                id="prefix-search-link"
                onClick={() => {
                  setActive(false);
                  setValue('');
                }}
              >
                {value}* <br />
                Prefix Search
              </StyledDropdownLink>
            </Column>}
        </Row>}
    </Container>,
);
export default PrefixFacet;
