import React from 'react';
import { compose, pure, setDisplayName, withState } from 'recompose';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';

import { styles } from './SelectSet';
import DemoButton from './DemoButton';

const enhance = compose(
  setDisplayName('EnhancedSelectScrnaSeq'),
  withState('selectedCase', 'setSelectedCase', null),
  withState('selectedWorkflow', 'setSelectedWorkflow', null),
  withState('resultId', 'setResultId', null),
  // TODO what is the result? case, file, etc
  // TODO on mount, make a graphql request to repo endpoint to get cases that match 2 workflow types
  pure,
);

const SelectScrnaSeq = ({
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
  resultId,
  selectedCase,
  selectedWorkflow,
  setSelectedCase,
  setResultId,
  setSelectedWorkflow,
}) => {
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
      <Row
        style={{
          ...styles.rowStyle,
          border: 'none',
          justifyContent: 'flex-end',
        }}
        >
        <Button
          disabled={!selectedCase || !selectedWorkflow}
          onClick={() => onRun(resultId)}
          >
          Run
        </Button>
      </Row>
    </Column>
  )
};

export default enhance(SelectScrnaSeq);