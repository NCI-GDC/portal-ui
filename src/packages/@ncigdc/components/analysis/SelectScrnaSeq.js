import React from 'react';
import { compose, pure, setDisplayName, withHandlers, withProps, withState } from 'recompose';
import { find } from 'lodash';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';

import { styles } from './SelectSet';
import DemoButton from './DemoButton';

const scrnaWorkflowTypes = [
  'Seurat - 10x Chromium',
  'Seurat - Smart-Seq2'
];
// TODO workflow types will be 10X chromium and smart-seq2.
// for now use existing workflow types with small data sets.

const exampleCases = [
  {
    caseId: 'C3N-11111-caseId',
    submitterId: 'C3N-11111',
    workflowTypes: [
      'Seurat - 10x Chromium',
      'Seurat - Smart-Seq2'
    ],
  },
  {
    caseId: 'C3N-22222-caseId',
    submitterId: 'C3N-22222',
    workflowTypes: [
      'Seurat - 10x Chromium',
    ],
  },
  {
    caseId: 'C3N-33333-caseId',
    submitterId: 'C3N-33333',
    workflowTypes: [
      'Seurat - 10x Chromium',
      'Seurat - Smart-Seq2'
    ],
  },
  {
    caseId: 'C3N-44444-caseId',
    submitterId: 'C3N-44444',
    workflowTypes: [
      'Seurat - Smart-Seq2'
    ],
  },
  {
    caseId: 'C3N-55555-caseId',
    submitterId: 'C3N-55555',
    workflowTypes: [
      'Seurat - 10x Chromium',
      'Seurat - Smart-Seq2'
    ],
  }
];


const enhance = compose(
  setDisplayName('EnhancedSelectScrnaSeq'),
  withState('selectedCase', 'setSelectedCase', null),
  withState('selectedWorkflow', 'setSelectedWorkflow', null),
  withState('resultId', 'setResultId', null),
  // TODO what is the result? case, file, etc
  // TODO on mount, make a graphql request to repo endpoint to get cases that match 2 workflow types
  withProps(({ selectedCase }) => {
    if (!selectedCase) {
      return ({ workflowTypes: null });
    }

    const caseObj = find(exampleCases, option => option.caseId === selectedCase);
    const { workflowTypes } = caseObj;

    return ({ workflowTypes });
  }),
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
  handleSelectCase,
  onCancel,
  onRun,
  resultId,
  selectedCase,
  selectedWorkflow,
  setResultId,
  setSelectedCase,
  setSelectedWorkflow,
  workflowTypes,
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

      <Row style={styles.rowStyle}>
        <Column style={{ flex: 1, marginBottom: 15  }}>
          <h2
            style={{
              color: '#c7254e',
              fontSize: '1.8rem',
            }}
            >
            Step 1: Select a case
          </h2>
          <label
            htmlFor="scrnaseq-select-case"
            style={{ marginBottom: 15 }}
            >
            Select a case with single cell RNA sequencing data available.
          </label>
          <select
            id="scrnaseq-select-case"
            name="scrnaseq-select-case"
            onChange={e => setSelectedCase(e.target.value)}
            style={{ width: 300 }}
            >
            <option value="">-- Select a case --</option>
            {exampleCases.map(option => (
              <option
                key={option.caseId}
                value={option.caseId}
                >
                {option.submitterId}
              </option>
            ))}
          </select>
        </Column>
      </Row>

      {workflowTypes && (
        <Row style={styles.rowStyle}>
          <Column style={{ flex: 1, marginBottom: 15 }}>
            <h2
              style={{
                color: '#c7254e',
                fontSize: '1.8rem',
              }}
              >
              Step 2: Select a workflow
            </h2>
            <div
              id="scrnaseq-select-workflow-description"
              style={{ marginBottom: 15 }}
              >
              Select an analysis workflow that was used for the selected case.
            </div>
            {workflowTypes.map(type => (
              <label key={type}>
                <input
                  aria-describedby="scrnaseq-select-workflow-description"
                  name="scrnaseq-select-workflow"
                  onChange={e => setSelectedWorkflow(e.target.value)}
                  type="radio"
                  value={type}
                  />
                {` ${type}`}
              </label>
            ))}
          </Column>
        </Row>
      )}

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