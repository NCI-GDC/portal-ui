// @flow
import React from 'react';
import {
  capitalize,
  get,
  omit,
  set,
  truncate,
} from 'lodash';
import { connect } from 'react-redux';
import { compose, withState, pure } from 'recompose';
import { Row, Column } from '@ncigdc/uikit/Flex';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import countComponents from '@ncigdc/modern_components/Counts';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Button from '@ncigdc/uikit/Button';
import ExploreLink, { defaultExploreQuery } from '@ncigdc/components/Links/ExploreLink';
import { theme } from '@ncigdc/theme/index';
import { TSetTypes } from '@ncigdc/dux/sets';
import DemoButton from './DemoButton';

type TProps = {
  sets: { [TSetTypes]: string },
  selectedSets: { [TSetTypes]: string },
  setSelectedSets: Function,
  setDisabledMessage: Function,
  label: string,
  setInstructions: string,
  onCancel: Function,
  onRun: Function,
  validateSets: Function,
  description: string,
  Icon: Function,
  setTypes: Array<string>,
  type: string,
  demoData: {},
};
const styles = {
  rowStyle: {
    marginTop: 'auto',
    padding: '1rem 2.5rem 1rem',
    borderBottom: `1px solid ${theme.greyScale5}`,
    maxWidth: 1100,
  },
};
const enhance = compose(
  connect(({ sets }) => ({ sets })),
  withState('selectedSets', 'setSelectedSets', {}),
  pure,
);

const SetTable = ({
  demoData,
  description,
  Icon,
  label,
  onCancel,
  onRun,
  selectedSets,
  setDisabledMessage = () => {},
  setInstructions,
  sets,
  setSelectedSets,
  setTypes,
  type,
  validateSets,
}: TProps) => {
  const isClinical = type === 'clinical_data';
  const headings = [
    {
      key: 'select',
      title: 'Select',
    },
    {
      key: 'type',
      title: 'Type',
    },
    {
      key: 'name',
      title: isClinical ? 'Case Set Name' : 'Name',
    },
    {
      key: 'count',
      title: isClinical ? '#Cases' : 'Items',
      style: { textAlign: 'right' },
    },
  ];
  if (isClinical) {
    headings.splice(1, 1);
  }

  const setData = Object.entries(sets)
    .filter(([setType]) => setTypes.includes(setType))
    .map(([setType, mappedSets]) => {
      const CountComponent = countComponents[setType];
      return Object.entries(mappedSets).map(([setId, l]: [string, any]) => {
        const id = `set-table-${setType}-${setId}-select`;
        const checked = get(selectedSets, `${setType}.${setId}`, false);
        const msg =
          !checked && setDisabledMessage({
            sets: selectedSets,
            type: setType,
          });
        return {
          select: (
            <Tooltip
              Component={msg}
              style={{
                cursor: msg ? 'not-allowed' : 'initial',
              }}
              >
              <input
                checked={checked}
                disabled={msg}
                id={id}
                onChange={e => {
                  const targetId = e.target.value;
                  const setIdPath = [setType, targetId];
                  setSelectedSets(
                    get(selectedSets, setIdPath)
                      ? { [setType]: omit(selectedSets[setType], setIdPath) }
                      : set(isClinical ? {} : { ...selectedSets }, setIdPath, mappedSets[targetId]),
                  );
                }}
                style={{
                  marginLeft: 3,
                  pointerEvents: msg ? 'none' : 'initial',
                }}
                type={isClinical ? 'radio' : 'checkbox'}
                value={setId}
                />
            </Tooltip>
          ),
          type: capitalize(setType === 'ssm' ? 'mutations' : `${setType}s`),
          name: <label htmlFor={id}>{truncate(l, { length: 70 })}</label>,
          count: (
            <CountComponent
              filters={{
                op: '=',
                content: {
                  field: `${setType}s.${setType}_id`,
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
    <Column
      style={{
        width: '70%',
        paddingLeft: '1rem',
        paddingTop: '2rem',
      }}
      >
      <Row
        spacing="10px"
        style={{
          ...styles.rowStyle,
          justifyContent: 'space-between',
        }}
        >
        <Icon />
        <Column style={{ flex: 1 }}>
          <h1 style={{ fontSize: '2rem' }}>{label}</h1>
          {description}
        </Column>
        <Column style={{ paddingTop: 5 }}>
          <Row spacing="5px">
            <Button onClick={onCancel}>Back</Button>
            <DemoButton demoData={demoData} type={type} />
          </Row>
        </Column>
      </Row>
      <Row style={styles.rowStyle}>
        <Column style={{ flex: 1 }}>
          <h2
            style={{
              color: '#c7254e',
              fontSize: '1.8rem',
            }}
            >
            {setData.length > 0
                  ? setInstructions
                  : 'You have not saved any sets yet.'}
          </h2>

          <div style={{ marginBottom: 15 }}>
            You can create and save case, gene and mutation sets of interest from the
            {' '}
            <ExploreLink query={defaultExploreQuery}>Exploration Page</ExploreLink>
            .
          </div>
          {setData && setData.length > 0 && (
            <EntityPageHorizontalTable
              data={setData}
              headings={headings}
              />
          )}

          {setData && setData.length === 0 && (
            <Row>
              <strong>You have not saved any sets yet.</strong>
            </Row>
          )}
        </Column>
      </Row>
      <Row
        style={{
          ...styles.rowStyle,
          border: 'none',
          justifyContent: 'flex-end',
        }}
        >
        <Button
          disabled={!validateSets(selectedSets)}
          onClick={() => onRun(selectedSets)}
          >
          Run
        </Button>
      </Row>
    </Column>
  );
};

export default enhance(SetTable);
