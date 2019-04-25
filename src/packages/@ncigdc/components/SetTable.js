// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  withProps, compose, withState, defaultProps,
} from 'recompose';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import countComponents from '@ncigdc/modern_components/Counts';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import { Tooltip } from '@ncigdc/uikit/Tooltip/index';

type TProps = {
  sets: {},
  setSelected: Function,
  selected: string,
  type: string,
  field: string,
  style: {},
  counts: {},
  setCounts: Function,
  getDisabledMessage: Function,
};

const enhance = compose(
  connect(({ sets }) => ({ sets })),
  withProps(({ sets, type }) => ({ sets: sets[type] || {} })),
  defaultProps({
    getDisabledMessage: () => null,
  }),
  withState('counts', 'setCounts', ({ sets }) => Object.keys(sets).reduce(
    (acc, key) => Object.assign(acc, { [key]: '' }),
    {},
  ),),
  withPropsOnChange(
    ['sets', 'counts'],
    ({
      sets, selected, setSelected, counts, getDisabledMessage,
    }) => {
      const setKeys = Object.keys(sets);
      if (
        !selected &&
        setKeys.length === 1 &&
        counts[setKeys[0]] !== '' &&
        !getDisabledMessage({ count: counts[setKeys[0]] })
      ) {
        setSelected(setKeys[0]);
      }
    },
  ),
);

const SetTable = ({
  sets,
  setSelected,
  selected,
  type,
  field,
  style,
  counts,
  setCounts,
  getDisabledMessage,
}: TProps) => {
  const CountComponent = countComponents[type];

  return (
    <EntityPageHorizontalTable
      data={Object.keys(sets).map((key, i) => {
        const id = `set-table-${key}-select`;
        const disabledMessage = getDisabledMessage({ count: counts[key] });

        return {
          select: (
            <Tooltip
              Component={disabledMessage || null}
              style={{
                cursor: disabledMessage ? 'not-allowed' : 'default',
              }}>
              <input
                checked={key === selected}
                disabled={disabledMessage}
                id={id}
                onChange={e => setSelected(e.target.value)}
                style={{
                  marginLeft: 3,
                  pointerEvents: disabledMessage ? 'none' : 'all',
                }}
                type="radio"
                value={key} />
            </Tooltip>
          ),
          name: <label htmlFor={id}>{sets[key]}</label>,
          count: (
            <CountComponent
              filters={{
                op: '=',
                content: {
                  field,
                  value: `set_id:${key}`,
                },
              }}
              handleCountChange={count => setCounts({
                ...counts,
                [key]: count,
              })} />
          ),
        };
      })}
      headings={[
        {
          key: 'select',
          title: ' ',
        },
        {
          key: 'name',
          title: 'Name',
        },
        {
          key: 'count',
          title: 'Items',
          style: { textAlign: 'right' },
        },
      ]}
      style={style} />
  );
};

export default enhance(SetTable);
