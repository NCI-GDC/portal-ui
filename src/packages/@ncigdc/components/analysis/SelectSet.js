// @flow
import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { Row, Column } from '@ncigdc/uikit/Flex';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import countComponents from '@ncigdc/modern_components/Counts';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Button from '@ncigdc/uikit/Button';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import { theme } from '@ncigdc/theme/index';
import removeEmptyKeys from '@ncigdc/utils/removeEmptyKeys';

import type { TSetTypes } from '../../dux/sets';

type TProps = {
  sets: { [TSetTypes]: string },
  selectedSets: { [TSetTypes]: string },
  setSelectedSets: Function,
  setDisabledMessage: Function,
  label: string,
  setInstructions: string,
  onCancel: Function,
  onDemo: Function,
  onRun: Function,
  validateSets: Function,
  description: string,
  Icon: Function,
  setTypes: Array<string>,
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
  label,
  setInstructions,
  onCancel,
  onDemo,
  onRun,
  validateSets,
  Icon,
  description,
  setTypes,
}: TProps) => {
  const headings = [
    { key: 'select', title: ' ' },
    { key: 'type', title: 'Type' },
    { key: 'name', title: 'Name' },
    { key: 'count', title: 'Items', style: { textAlign: 'right' } },
  ];
  const setData = Object.entries(sets)
    .filter(([type]) => setTypes.includes(type))
    .map(([type, sets]) => {
      const CountComponent = countComponents[type];

      return Object.entries(sets).map(([setId, label]: [string, any]) => {
        const id = `set-table-${type}-${setId}-select`;
        const checked = Boolean((selectedSets[type] || {})[setId]);

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
                id={id}
                type="checkbox"
                value={setId}
                disabled={msg}
                onChange={e => {
                  const setId = e.target.value;
                  const setIdPath = [type, setId];
                  setSelectedSets(
                    _.get(selectedSets, setIdPath)
                      ? removeEmptyKeys(_.omit(selectedSets, setIdPath))
                      : _.set({ ...selectedSets }, setIdPath, sets[setId]),
                  );
                }}
                checked={checked}
              />
            </Tooltip>
          ),
          type: _.capitalize(type === 'ssm' ? 'mutations' : type + 's'),
          name: <label htmlFor={id}>{_.truncate(label, { length: 70 })}</label>,
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
    <div>
      <Row>
        <Column style={{ padding: '2rem 2.5rem 0', flex: 1 }}>
          <Row>
            <Row
              style={{
                width: 120,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon style={{ fontSize: 40, marginRight: 25 }} />
            </Row>
            <div>
              <h1 style={{ fontSize: '2rem' }}>{label}</h1>
              <div style={{ marginBottom: 10 }}>{description}</div>
            </div>
          </Row>
          <Row
            spacing={5}
            style={{
              marginTop: 'auto',
              justifyContent: 'flex-end',
              padding: '1rem 2.5rem 1rem',
              borderTop: `1px solid ${theme.greyScale5}`,
            }}
          >
            <Button onClick={onCancel}>Cancel</Button>
            <Button onClick={onDemo}>Demo</Button>
            <Button
              disabled={!validateSets(selectedSets)}
              onClick={() => onRun(selectedSets)}
            >
              Run
            </Button>
          </Row>
        </Column>

        {setData.length ? (
          <div style={{ flex: 1 }}>
            <div style={{ margin: '2rem 0' }}>
              <div>
                <strong>{setInstructions}</strong>
              </div>
              <div style={{ fontStyle: 'italic' }}>
                You can create and save case, gene and mutation sets of interest
                from the <ExploreLink>Exploration Page</ExploreLink>
              </div>
            </div>
            <EntityPageHorizontalTable data={setData} headings={headings} />
          </div>
        ) : (
          <EntityPageHorizontalTable
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
          />
        )}
      </Row>
    </div>
  );
};

export default enhance(SetTable);
