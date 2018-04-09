// @flow

import React from 'react';
import { Row, Column } from '@ncigdc/uikit/Flex';
import styled from '@ncigdc/theme/styled';
import GDCAppsRow from '@ncigdc/components/GDCApps/GDCAppsRow';
import ExploringLinks from '@ncigdc/components/ExploringLinks';
import HomeSearch from '@ncigdc/components/HomeSearch';
import PortalSummary from '@ncigdc/modern_components/PortalSummary';
import HumanBody from '@ncigdc/modern_components/HumanBody';
import { zDepth1 } from '@ncigdc/theme/mixins';

const Title = styled.h1({
  color: 'white',
  fontSize: '3rem',
  marginTop: '0.7rem',
});

const SubTitle = styled.div({
  color: 'white',
});

const GradientContainer = styled(Row, {
  backgroundColor: '#000',
  backgroundImage:
    'radial-gradient(ellipse at center, rgba(147,206,222,1) 0%, rgba(117,189,209,1) 48%, rgba(73,129,189,1) 100%)',
});

const containerStyle = {
  flex: 1,
  padding: '3rem',
  height: '50rem',
  position: 'relative',
};

const Container = styled(Column, {
  ...zDepth1,
  marginTop: '2rem',
  backgroundColor: 'white',
  borderTop: '3px solid rgb(37, 208, 182)',
});

const InsideContainer = styled.div(containerStyle);

const Home = () => (
  <Column className="test-home">
    <GradientContainer>
      <InsideContainer flex="1">
        <SubTitle style={{ fontSize: '2rem' }}>
          Harmonized Cancer Datasets
        </SubTitle>
        <Title>Genomic Data Commons Data Portal</Title>
        <SubTitle style={{ margin: '1rem 0' }}>
          <em>Get Started by Exploring:</em>
        </SubTitle>
        <ExploringLinks />
        <HomeSearch />
        <Container className="test-portal-summary">
          <PortalSummary />
        </Container>
      </InsideContainer>
      <Row flex="1">
        <HumanBody />
      </Row>
    </GradientContainer>
    <Column style={{ paddingTop: '7rem', alignItems: 'center' }}>
      <Row style={{ fontSize: '1.3em' }}>GDC Applications</Row>
      <Row style={{ textAlign: 'center' }}>
        The GDC Data Portal is a robust data-driven platform that allows cancer
        <br />
        researchers and bioinformaticians to search and download cancer data for
        analysis. The GDC applications include:
      </Row>
      <GDCAppsRow />
    </Column>
  </Column>
);

export default Home;
