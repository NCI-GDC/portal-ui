import React from 'react';
import { Column, Row } from '@ncigdc/uikit/Flex';
import CohortDropdown from './CohortDropdown';

export default ({
  currentAnalysis, allSets, dispatch, Icon,
}) => (
  <Column style={{ margin: '2rem' }}>
    <Row
      spacing="10px"
      style={{
        alignItems: 'center',
        width: '80%',
      }}>
      <Icon style={{
        height: 50,
        width: 50,
      }} />
      <h1 style={{
        fontSize: '2.5rem',
        margin: 5,
      }}>
Clinical Analysis
      </h1>
    </Row>
    <Row style={{
      marginTop: '1rem',
      marginLeft: '1rem',
    }}>
      Analysis is deprecated because
      {' '}
      {currentAnalysis.name}
      {' '}
is a deprecated set.
    </Row>
    <Row style={{ marginTop: '1rem' }}>
      <CohortDropdown
        currentAnalysis={currentAnalysis}
        dispatch={dispatch}
        sets={allSets} />
    </Row>
  </Column>
);
