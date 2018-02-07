// @flow

import React from 'react';
import { compose, setDisplayName } from 'recompose';
import ArrowDownIcon from 'react-icons/lib/fa/long-arrow-down';
import ArrowUpIcon from 'react-icons/lib/fa/long-arrow-up';

import withRouter from '@ncigdc/utils/withRouter';
import { parseJSONParam, stringifyJSONParam } from '@ncigdc/utils/uri';
import { SortIcon } from '@ncigdc/theme/icons';
import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import styled from '@ncigdc/theme/styled';
import Link from '@ncigdc/components/Links/Link';
import Hidden from '@ncigdc/components/Hidden';
import { withTheme } from '@ncigdc/theme';

/*----------------------------------------------------------------------------*/

const RadioRow = styled(Row, {
  padding: '0.3rem 0.6rem',
  marginLeft: 'auto',
  alignItems: 'center',
});

type TSortTableButtonProps = {
  style: Object,
  options: Array<Object>,
  query: Object,
  sortKey: string,
  theme: Object,
  isDisabled?: boolean,
};

const SortTableButton = compose(
  setDisplayName('SortTableButton'),
  withRouter,
  withTheme,
)(
  (
    {
      style,
      options,
      query: q,
      sortKey,
      theme,
      isDisabled,
    }: TSortTableButtonProps = {},
  ) => {
    const { [sortKey]: sort } = q;
    const fields = parseJSONParam(sort, []);

    return (
      <Dropdown
        autoclose={false}
        isDisabled={isDisabled}
        button={
          <Tooltip Component={<span>Sort Table</span>}>
            <Button style={style} disabled={isDisabled}>
              <SortIcon />
              <Hidden>Sort Table</Hidden>
            </Button>
          </Tooltip>
        }
        dropdownStyle={{ top: '100%', marginTop: 5, whiteSpace: 'nowrap' }}
      >
        {options.map(x => {
          const sameField = fields.filter(f => f.field === x.id)[0];
          const otherFields = fields.filter(f => f.field !== x.id);
          const nextSort = sameField
            ? otherFields
            : [...otherFields, { field: x.id, order: 'asc' }];

          return (
            <DropdownItem
              key={x.id}
              style={{
                lineHeight: '1.5',
                borderRight: '2px solid transparent',
                ':hover': {
                  borderRight: `2px solid ${theme.secondary}`,
                },
              }}
            >
              <Row flex="1 1 auto" style={{ padding: '0.3rem 0.6rem' }}>
                <Link
                  style={{ width: '100%' }}
                  merge
                  query={{
                    [sortKey]: stringifyJSONParam(nextSort),
                  }}
                >
                  <input
                    readOnly
                    style={{ pointerEvents: 'none' }}
                    type="checkbox"
                    checked={!!sameField}
                    name={x.name}
                    aria-label={x.name}
                  />
                  <label htmlFor={x.name} style={{ marginLeft: '0.3rem' }}>
                    {x.name}
                  </label>
                </Link>
              </Row>
              <RadioRow>
                <Link
                  style={{ width: '100%' }}
                  merge
                  query={{
                    [sortKey]: stringifyJSONParam([
                      ...otherFields,
                      { field: x.id, order: 'asc' },
                    ]),
                  }}
                >
                  <ArrowDownIcon />
                  <input
                    readOnly
                    type="radio"
                    checked={!!sameField && sameField.order === 'asc'}
                    style={{ pointerEvents: 'none' }}
                    aria-label={'sort-ascending'}
                  />
                </Link>
                <Link
                  style={{ width: '100%' }}
                  merge
                  query={{
                    [sortKey]: stringifyJSONParam([
                      ...otherFields,
                      { field: x.id, order: 'desc' },
                    ]),
                  }}
                >
                  <ArrowUpIcon />
                  <input
                    readOnly
                    type="radio"
                    checked={!!sameField && sameField.order === 'desc'}
                    style={{ pointerEvents: 'none' }}
                    aria-label={'sort-descending'}
                  />
                </Link>
              </RadioRow>
            </DropdownItem>
          );
        })}
      </Dropdown>
    );
  },
);

/*----------------------------------------------------------------------------*/

export default SortTableButton;
