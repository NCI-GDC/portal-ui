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
import { compose, setDisplayName, withReducer } from 'recompose';
import { IRawQuery } from '@ncigdc/utils/uri/types';
import { isEqual, xorWith } from 'lodash';
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

type TAddSortKey = IReducerAction<'addSortKey', ISortSelection>;
type TRemoveSortKey = IReducerAction<'removeSortKey', ISortSelection>;
type TToggleSortKey = IReducerAction<'toggleSortKey', ISortSelection>;
type TChangeSortDirection = IReducerAction<
  'changeSortDirection',
  ISortSelection
>;

type TSortTableButtonReducerAction =
  | TAddSortKey
  | TRemoveSortKey
  | TToggleSortKey
  | TChangeSortDirection;

interface ISortSelection {
  sortKey: string;
  sortDirection: string;
}

interface ISortUiState {
  [key: string]: {
    selected: boolean;
    asc: boolean;
    desc: boolean;
  };
}

interface ISortTableButtonState {
  sortSelection: ReadonlyArray<ISortSelection>;
  ui: Readonly<ISortUiState>;
}

type TSortTableButtonSortFunc = (s: ISortTableButtonState) => void;

type TSortTableReducer = (
  s: ISortTableButtonState,
  a: TSortTableButtonReducerAction
) => ISortTableButtonState;

export interface ISortTableOptions {
  id: string;
  name: string;
}

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
    cb: TSortTableButtonSortFunc
  ) => void;
}

const sortTableReducer: TSortTableReducer = (state, action) => {
  switch (action.type) {
    case 'addSortKey':
      return {
        ...state,
        sortSelection: [...state.sortSelection, action.payload],
        ui: {
          ...state.ui,
          [action.payload.sortKey]: {
            ...state.ui[action.payload.sortKey],
            selected: true,
            [action.payload.sortDirection]: true,
          },
        },
      };
    case 'removeSortKey':
      return {
        ...state,
        sortSelection: state.sortSelection.filter(
          selection => !isEqual(selection, action.payload)
        ),
        ui: {
          ...state.ui,
          [action.payload.sortKey]: {
            ...state.ui[action.payload.sortKey],
            selected: false,
            asc: false,
            desc: false,
          },
        },
      };
    case 'toggleSortKey':
      return {
        ...state,
        sortSelection: xorWith(state.sortSelection, [action.payload], isEqual),
        ui: {
          ...state.ui,
          [action.payload.sortKey]: {
            selected: !state.ui[action.payload.sortKey].selected,
            asc: !state.ui[action.payload.sortKey].selected === true,
            desc: false,
          },
        },
      };
    case 'changeSortDirection':
      return {
        ...state,
        sortSelection: [...state.sortSelection, action.payload],
        ui: {
          ...state.ui,
          [action.payload.sortKey]: {
            ...state.ui[action.payload.sortKey],
            selected: true,
            asc: false,
            desc: false,
            [action.payload.sortDirection]: true,
          },
        },
      };
    default:
      return state;
  }
};

type TGenerateInitialState = (
  p: ICSortTableButtonProps
) => ISortTableButtonState;
const generateInitialState: TGenerateInitialState = props => ({
  sortSelection: [],
  ui: props.options.reduce((acc, { id }) => {
    // TODO: base initial state on query if passed in
    acc[id] = {
      selected: false,
      asc: false,
      desc: false,
    };

    return acc;
  }, {}),
});

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
  >('state', 'dispatch', sortTableReducer, generateInitialState),
  setDisplayName('SortTableButton'),
  withRouter,
  withTheme
)(({ state, dispatch, style, options, theme, isDisabled }) => {
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
                  dispatch(
                    {
                      type: 'toggleSortKey',
                      payload: {
                        sortKey: id,
                        sortDirection: 'asc',
                      },
                    },
                    newState => {
                      console.log('call sort function here with this state: ', newState);
                    }
                  )}
              >
                <input
                  readOnly
                  style={{ pointerEvents: 'none' }}
                  type="checkbox"
                  checked={state.ui[id].selected}
                  onClick={() => console.log('texzt')}
                  name={name}
                  aria-label={name}
                />
                <label htmlFor={name} style={{ marginLeft: '0.3rem' }}>
                  {name}
                </label>
              </div>
            </Row>
            <RadioRow>
              <Link style={{ width: '100%' }}>
                <ArrowDownIcon />
                <input
                  readOnly
                  type="radio"
                  checked={state.ui[id].asc}
                  style={{ pointerEvents: 'none' }}
                  aria-label={'sort-ascending'}
                />
              </Link>
              <Link style={{ width: '100%' }}>
                <ArrowUpIcon />
                <input
                  readOnly
                  type="radio"
                  checked={state.ui[id].desc}
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

export default SortTableButtonDD;
