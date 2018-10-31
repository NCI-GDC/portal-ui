import ArrowDownIcon from 'react-icons/lib/fa/long-arrow-down';
import ArrowUpIcon from 'react-icons/lib/fa/long-arrow-up';
import Button from '@ncigdc/uikit/Button';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Hidden from '@ncigdc/components/Hidden';
import React from 'react';
import styled from '@ncigdc/theme/styled';
import withRouter from '@ncigdc/utils/withRouter';
import { compose, setDisplayName, withReducer } from 'recompose';
import { find, get, isEqual, xorWith } from 'lodash';
import { IRawQuery } from '@ncigdc/utils/uri/types';
import { ITheme, withTheme } from '@ncigdc/theme';
import { Row } from '@ncigdc/uikit/Flex';
import { SortIcon } from '@ncigdc/theme/icons';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

const RadioRow = styled(Row, {
  padding: '0.3rem 0.6rem',
  marginLeft: 'auto',
  alignItems: 'center',
});

interface IReducerAction<T, P> {
  type: T;
  payload: P;
}

interface ISortSelection {
  sortKey: string;
  sortDirection: string;
}
interface ISortTableButtonState {
  sortSelection: ReadonlyArray<ISortSelection>;
}

type TSortActionNames = 'toggleSortKey' | 'changeSortDirection';
type TSortTableButtonReducerAction = IReducerAction<
  TSortActionNames,
  ISortSelection
>;

type TSortTableReducer = (
  s: ISortTableButtonState,
  a: TSortTableButtonReducerAction
) => ISortTableButtonState;

type TSortTableButtonDispatch = (s: ISortTableButtonState) => void;

export interface ISortTableOptions {
  id: string;
  name: string;
}
export type TSortTableButtonSortFunc = (s: ReadonlyArray<ISortSelection>) => void;
interface ISortTableButtonProps {
  sortFunction: TSortTableButtonSortFunc;
  sortKey: string;
  options: ISortTableOptions[];
  theme?: ITheme;
  style?: object;
  query?: IRawQuery;
  isDisabled?: boolean;
}

interface ICSortTableButtonProps extends ISortTableButtonProps {
  state: ISortTableButtonState;
  dispatch: (
    a: TSortTableButtonReducerAction,
    cb: TSortTableButtonDispatch
  ) => void;
}

const sortTableReducer: TSortTableReducer = (state, action) => {
  switch (action.type) {
    case 'toggleSortKey':
      return {
        ...state,
        sortSelection: xorWith(state.sortSelection, [action.payload], isEqual),
      };
    case 'changeSortDirection':
      return {
        ...state,
        sortSelection: [
          ...state.sortSelection.filter(
            s => !isEqual(s.sortKey, action.payload.sortKey)
          ),
          action.payload,
        ],
      };
    default:
      return state;
  }
};

interface ISortUiState {
  [key: string]: {
    selected: boolean;
    asc: boolean;
    desc: boolean;
  };
}
type TUiStateReduce = (
  s: ReadonlyArray<ISortSelection>,
  o: ISortTableOptions[]
) => ISortUiState;
const uiStateReduce: TUiStateReduce = (selectionState, selectionOptions) =>
  selectionOptions.reduce((acc, curr) => {
    const selection = find(
      selectionState,
      (s: ISortSelection) => s.sortKey === curr.id
    );
    const sortDir = get(selection, 'sortDirection', false);
    acc[curr.id] = {
      selected: selection || false,
      asc: sortDir === 'asc',
      desc: sortDir === 'desc',
    };
    return acc;
  }, {});

const SortTableButtonDD = compose<
  ICSortTableButtonProps,
  ISortTableButtonProps
>(
  withReducer<
    ISortTableButtonProps,
    ISortTableButtonState,
    TSortTableButtonReducerAction,
    string,
    string
  >('state', 'dispatch', sortTableReducer, { sortSelection: [] }),
  setDisplayName('SortTableButton'),
  withRouter,
  withTheme
)(({ state, dispatch, sortFunction, style, options, theme, isDisabled }) => {
  const uiState = uiStateReduce(state.sortSelection, options);

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
        const dispatchAction = (
          sType: TSortActionNames,
          sId: string,
          sDir: string
        ) =>
          dispatch(
            {
              type: sType,
              payload: {
                sortKey: sId,
                sortDirection: sDir,
              },
            },
            ({ sortSelection }) => {
              console.log(
                'call sort function here with this state: ',
                sortSelection
              );
              sortFunction(sortSelection);
            }
          );

        return (
          <DropdownItem
            key={id}
            style={{
              lineHeight: '1.5',
              borderRight: '2px solid transparent',
              ':hover': {
                borderRight: `2px solid ${theme
                  ? theme.secondary
                  : 'transparent'}`,
              },
            }}
          >
            <Row flex="1 1 auto" style={{ padding: '0.3rem 0.6rem' }}>
              <div
                style={{
                  width: '100%',
                  color: 'rgb(0, 80, 131)',
                }}
                onClick={() =>
                  dispatchAction(
                    'toggleSortKey',
                    id,
                    uiState[id].desc ? 'desc' : 'asc'
                  )}
              >
                <input
                  readOnly
                  style={{ pointerEvents: 'none' }}
                  type="checkbox"
                  checked={uiState[id].selected}
                  name={name}
                  aria-label={name}
                />
                <label htmlFor={name} style={{ marginLeft: '0.3rem' }}>
                  {name}
                </label>
              </div>
            </Row>
            <RadioRow>
              <div
                style={{ width: '100%' }}
                onClick={() => dispatchAction('changeSortDirection', id, 'asc')}
              >
                <ArrowDownIcon />
                <input
                  readOnly
                  type="radio"
                  checked={uiState[id].asc}
                  style={{ pointerEvents: 'none' }}
                  aria-label={'sort-ascending'}
                />
              </div>
              <div
                style={{ width: '100%' }}
                onClick={() =>
                  dispatchAction('changeSortDirection', id, 'desc')}
              >
                <ArrowUpIcon />
                <input
                  readOnly
                  type="radio"
                  checked={uiState[id].desc}
                  style={{ pointerEvents: 'none' }}
                  aria-label={'sort-descending'}
                />
              </div>
            </RadioRow>
          </DropdownItem>
        );
      })}
    </Dropdown>
  );
});

export default SortTableButtonDD;
