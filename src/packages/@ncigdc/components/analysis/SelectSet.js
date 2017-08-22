// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { xor } from 'lodash';

import { Row } from '@ncigdc/uikit/Flex';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { ExploreCaseCount, GeneCount } from '@ncigdc/modern_components/Counts';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Button from '@ncigdc/uikit/Button';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';

const countComponents = {
  case: ExploreCaseCount,
  gene: GeneCount,
};

type TProps = {
  sets: {},
  selectedSets: {},
  setSelectedSets: Function,
  setDisabledMessage: Function,
  title: string,
  setInstructions: string,
  onCancel: Function,
  onDemo: Function,
  onRun: Function,
  validateSets: Function,
};

const enhance = compose(
  connect(({ sets }) => ({ sets })),
  withState('selectedSets', 'setSelectedSets', {}),
);

const SetTable = ({
  sets,
  selectedSets,
  setSelectedSets,
  setDisabledMessage,
  title,
  setInstructions,
  onCancel,
  onDemo,
  onRun,
  validateSets,
}: TProps) => {
  const headings = [
    { key: 'select', title: ' ' },
    { key: 'type', title: 'Type' },
    { key: 'name', title: 'Name' },
    { key: 'count', title: 'Items', style: { textAlign: 'right' } },
  ];
  const setData = Object.entries(sets)
    .map(([type, sets]: [string, any], i) => {
      const CountComponent = countComponents[type];

      return Object.entries(sets).map(([setId, label]: [string, any], j) => {
        const id = `set-table-${type}-${setId}-select`;
        const checked = (selectedSets[type] || []).includes(setId);

        const msg =
          !checked && setDisabledMessage({ sets: selectedSets, type });

        return {
          select: (
            <Tooltip
              Component={msg}
              style={{
                cursor: msg ? 'not-allowed' : 'initial',
              }}
            >
              <input
                style={{
                  marginLeft: 3,
                  pointerEvents: msg ? 'none' : 'initial',
                }}
                autoFocus={j === 0 && i === 0}
                id={id}
                type="checkbox"
                value={setId}
                disabled={msg}
                onChange={e =>
                  setSelectedSets({
                    ...selectedSets,
                    [type]: xor(selectedSets[type], [e.target.value]),
                  })}
                checked={checked}
              />
            </Tooltip>
          ),
          type: type.replace(/^./, m => m.toUpperCase()),
          name: <label htmlFor={id}>{label}</label>,
          count: (
            <CountComponent
              filters={{
                op: '=',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setId}`,
                },
              }}
            />
          ),
        };
      });
    })
    .reduce((acc, rows) => acc.concat(rows), []);

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      <div>
        You can edit and save case and gene sets of interest from the{' '}
        <ExploreLink>Exploration Page</ExploreLink>
      </div>
      <h1 style={{ fontSize: '2rem' }}>{title}</h1>
      <div>{setInstructions}</div>
      {setData.length
        ? <EntityPageHorizontalTable data={setData} headings={headings} />
        : <EntityPageHorizontalTable
            data={[{ select: 'No saved set' }]}
            headings={[
              {
                ...headings[0],
                tdProps: { colSpan: 4 },
                tdStyle: { textAlign: 'center' },
              },
              ...headings.slice(1).map(h => ({
                ...h,
                tdStyle: { display: 'none' },
              })),
            ]}
          />}
      <Row spacing={5} style={{ justifyContent: 'flex-end', marginTop: 10 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onDemo}>Demo</Button>
        <Button
          disabled={!validateSets(selectedSets)}
          onClick={() => onRun(selectedSets)}
        >
          Run
        </Button>
      </Row>
    </div>
  );
};

export default enhance(SetTable);
