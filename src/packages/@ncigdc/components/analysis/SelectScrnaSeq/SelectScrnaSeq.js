import React from 'react';
import { compose, lifecycle, pure, setDisplayName, withHandlers, withProps, withState } from 'recompose';
import { find } from 'lodash';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';

import { styles } from '../SelectSet';
import DemoButton from '../DemoButton';

const enhance = compose(
  setDisplayName('SelectScrnaSeqPresentation'),
  withState('selectedCase', 'setSelectedCase', null),
  withState('selectedFile', 'setSelectedFile', null),
  pure,
);

const SelectScrnaSeq = ({
  analysisProps: {
    demoData,
    description,
    Icon,
    label,
    setInstructions,
    setTypes,
    type,
    validateSets,
  },
  onCancel,
  onRun,
  selectedCase,
  selectedFile,
  setSelectedCase,
  setSelectedFile,
  viewer: { repository: { cases: { hits } } },
}) => {
  const scrnaSeqCases = hits && hits.edges;
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
            {scrnaSeqCases.map(({ node: { case_id, submitter_id }}) => (
              <option
                key={case_id}
                value={case_id}
                >
                {submitter_id}
              </option>
            ))}
          </select>
        </Column>
      </Row>

      {/* {workflowTypes && (
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
                  onChange={e => setSelectedFile(e.target.value)}
                  type="radio"
                  value={type}
                  />
                {` ${type}`}
              </label>
            ))}
          </Column>
        </Row>
      )} */}

      <Row
        style={{
          ...styles.rowStyle,
          border: 'none',
          justifyContent: 'flex-end',
        }}
        >
        <Button
          disabled={!selectedCase || !selectedFile}
          onClick={() => onRun(selectedFile)}
          >
          Run
        </Button>
      </Row>
    </Column>
  )
};

export default enhance(SelectScrnaSeq);