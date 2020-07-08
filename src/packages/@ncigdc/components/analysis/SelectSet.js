import React from 'react';
import {
  capitalize,
  get,
  omit,
  set,
  truncate,
} from 'lodash';
import countComponents from '@ncigdc/modern_components/Counts';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { connect } from 'react-redux';
import { compose, withState, pure } from 'recompose';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { theme } from '@ncigdc/theme/index';
import DemoButton from './DemoButton';
import SetTable from './SetTable';
import ValidateGeneExpression from './ValidateGeneExpression';

const styles = {
  rowStyle: {
    borderBottom: `1px solid ${theme.greyScale5}`,
    marginTop: 'auto',
    maxWidth: 1100,
    padding: '1rem 2.5rem 1rem',
  },
};

const enhance = compose(
  connect(({ sets }) => ({ sets })),
  withState('selectedSets', 'setSelectedSets', {}),
  pure,
);

const SelectSet = ({
  analysisProps: {
    demoData,
    description,
    Icon,
    label,
    setDisabledMessage = () => {},
    setInstructions,
    setTypes,
    type,
    validateSets,
  },
  onCancel,
  onRun,
  selectedSets,
  sets = {},
  setSelectedSets,
}) => {
  const isClinical = type === 'clinical_data';
  const isGeneExpression = type === 'gene_expression';

  const setsData = specificType => Object.entries(sets)
    .filter(([setType]) => (specificType
      ? setType === specificType
      : setTypes.includes(setType)
    ))
    .map(([setType, mappedSets]) => {
      const CountComponent = countComponents[setType];

      return Object.entries(mappedSets)
        .map(([setId, l]: [string, any]) => {
          const id = `set-table-${setType}-${setId}-select`;
          const checked = get(selectedSets, `${setType}.${setId}`, false);
          const msg = !checked && setDisabledMessage({
            sets: selectedSets,
            type: setType,
          });

          return {
            count: (
              <CountComponent
                filters={{
                  content: {
                    field: `${setType}s.${setType}_id`,
                    value: `set_id:${setId}`,
                  },
                  op: '=',
                }}
                />
            ),
            name: <label htmlFor={id}>{truncate(l, { length: 70 })}</label>,
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
                  onChange={({ target }) => {
                    const targetId = target.value;
                    const setIdPath = [setType, targetId];

                    setSelectedSets(
                      isClinical || isGeneExpression //  for radio buttons
                        ? set( // switch the radio button
                          omit({ ...selectedSets }, setType), // keep only the sets of other types
                          setIdPath,
                          mappedSets[targetId], // then add the one selected set
                        )
                        : get(selectedSets, setIdPath) // for checkboxes
                          // is it checked?
                          ? Object.keys(omit({ ...selectedSets[setType] }, setIdPath)).length
                            // if it is not the only set of its type
                            ? { // remove the selected set
                              ...selectedSets,
                              [setType]: omit({ ...selectedSets[setType] }, setIdPath),
                            }
                            // else, remove the empty set type
                            : omit({ ...selectedSets }, setType)
                          // else, check it
                          : set(
                            { ...selectedSets },
                            setIdPath,
                            mappedSets[targetId],
                          ),
                    );
                  }}
                  style={{
                    marginLeft: 3,
                    pointerEvents: msg ? 'none' : 'initial',
                  }}
                  type={isClinical || isGeneExpression ? 'radio' : 'checkbox'}
                  value={setId}
                  />
              </Tooltip>
            ),
            type: capitalize(setType === 'ssm' ? 'mutations' : `${setType}s`),
          };
        });
    })
    .reduce((acc, rows) => acc.concat(rows), []);

  return (
    <Column
      style={{
        paddingLeft: '1rem',
        paddingTop: '2rem',
        width: '70%',
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

      {isGeneExpression
        ? setTypes
          .map((setType, typeStep) => (
            <SetTable
              analysisType={type}
              key={setType}
              setInstructions={setInstructions}
              setsData={setsData(setType)}
              setType={setType}
              step={typeStep + 1}
              styles={styles}
              />
          ))
          .concat(
            <ValidateGeneExpression
              key="validation"
              selectedSets={selectedSets}
              styles={styles}
              />,
          )
        : (
          <SetTable
            isClinical={isClinical}
            setInstructions={setInstructions}
            setsData={setsData()}
            setType={setTypes.length > 1 ? setTypes : setTypes[0]}
            styles={styles}
            />
        )}

      <Row
        style={{
          ...styles.rowStyle,
          border: 'none',
          justifyContent: 'flex-end',
        }}
        >
        {isGeneExpression && (
          <Button
            disabled={!validateSets(selectedSets)}
            onClick={() => onRun(selectedSets)}
            style={{
              marginRight: 5,
            }}
            >
            Check Data
          </Button>
        )}
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

export default enhance(SelectSet);
