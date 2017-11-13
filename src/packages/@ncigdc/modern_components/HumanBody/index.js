import React from 'react';
import ApolloQuery from '@ncigdc/modern_components/ApolloQuery';
import { Row, Column } from '@ncigdc/uikit/Flex';
import styled from '@ncigdc/theme/styled';
import Component from './HumanBody';
import query from './HumanBody.query';

const CenteredColumnContainer = styled(Column, {
  flex: 1,
  padding: '3rem',
  height: '50rem',
  position: 'absolute !important',
  alignItems: 'center',
  justifyContent: 'center',
  top: 0,
  width: '100%',
});

const Loader = ({ loading }) =>
  !loading ? null : (
    <CenteredColumnContainer>
      <Row
        style={{
          color: 'white',
          fontSize: '1.2em',
          marginBottom: '1rem',
        }}
      >
        Loading, please wait...
      </Row>
      <span
        style={{ color: 'white' }}
        className="fa fa-spinner fa-spin fa-2x"
      />
    </CenteredColumnContainer>
  );

export default ApolloQuery({ query, Component, Loader, minHeight: 200 });
