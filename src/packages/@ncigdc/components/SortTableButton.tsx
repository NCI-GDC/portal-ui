import ArrowDownIcon from 'react-icons/lib/fa/long-arrow-down';
import ArrowUpIcon from 'react-icons/lib/fa/long-arrow-up';
import Button from '@ncigdc/uikit/Button';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Hidden from '@ncigdc/components/Hidden';
import Link from '@ncigdc/components/Links/Link';
import React from 'react';
import styled from '@ncigdc/theme/styled';
import withRouter from '@ncigdc/utils/withRouter';
import { compose, setDisplayName } from 'recompose';
import { IRawQuery } from '@ncigdc/utils/uri/types';
import { ITheme, withTheme } from '@ncigdc/theme';
import { parseJSONParam, stringifyJSONParam } from '@ncigdc/utils/uri';
import { Row } from '@ncigdc/uikit/Flex';
import { SortIcon } from '@ncigdc/theme/icons';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

const RadioRow = styled(Row, {
  padding: '0.3rem 0.6rem',
  marginLeft: 'auto',
  alignItems: 'center',
});

type TSortTableButtonSortFunc = (
  identifier: string,
  direction: string
) => string;

interface ISortTableButtonProps {
  sortFunction: TSortTableButtonSortFunc;
  sortKey: string;
  options: object[];
  theme?: ITheme;
  style?: object;
  query?: IRawQuery;
  isDisabled?: boolean;
}

const SortTableButton = compose<ISortTableButtonProps, ISortTableButtonProps>(
  setDisplayName('SortTableButton'),
  withRouter,
  withTheme
)(({ style, options, query: q, sortKey, theme, isDisabled }) => {
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
      {options.map(({ id, name }: { id: string; name: string }) => {
        const sameField = fields.filter(
          ({ field }: { field: string }) => field === id
        )[0];
        const otherFields = fields.filter(
          ({ field }: { field: string }) => field !== id
        );
        const nextSort = sameField
          ? otherFields
          : [...otherFields, { field: id, order: 'asc' }];

        return (
          <DropdownItem
            key={id}
            style={{
              lineHeight: '1.5',
              borderRight: '2px solid transparent',
              ':hover': {
                borderRight: `2px solid ${theme ? theme.secondary : 'transparent'}`,
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
                  name={name}
                  aria-label={name}
                />
                <label htmlFor={name} style={{ marginLeft: '0.3rem' }}>
                  {name}
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
                    { field: id, order: 'asc' },
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
                    { field: id, order: 'desc' },
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
});

/*----------------------------------------------------------------------------*/

export default SortTableButton;
