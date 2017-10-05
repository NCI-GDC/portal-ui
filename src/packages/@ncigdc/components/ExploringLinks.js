// @flow
import React from 'react';
import Color from 'color';

import styled from '@ncigdc/theme/styled';
import { Row } from '@ncigdc/uikit/Flex';

import ProjectsLink from './Links/ProjectsLink';
import RepositoryLink from './Links/RepositoryLink';
import ExploreLink from './Links/ExploreLink';
import AnalysisLink from './Links/AnalysisLink';
import { AnalysisIcon } from '../theme/icons/index';

const linkStyle = {
  textDecoration: 'none !important',
  color: 'white !important',
  display: 'inline-block',
  whiteSpace: 'nowrap',
  padding: '0.5rem 1rem 0.5rem 0.5rem',
  textAlign: 'left',
  fontSize: '1.5rem',
  minWidth: '13.5rem',
  margin: 0,
  height: '4rem',
  borderRadius: '6px',
  transition: '0.25s ease all',
  backgroundColor: props => props.backgroundColor || props.theme.primary,
  ':hover': {
    backgroundColor: props =>
      Color(props.backgroundColor || props.theme.primary)
        .lighten(0.2)
        .rgbString(),
  },
};

const Projects = styled(ProjectsLink, linkStyle);
const Cohort = styled(ExploreLink, linkStyle);
const Repository = styled(RepositoryLink, linkStyle);
const Analysis = styled(AnalysisLink, linkStyle);

const Background = styled.span({
  backgroundColor: 'rgba(255, 255, 255, 0.35)',
  borderRadius: '0.5rem',
  width: '3.6rem',
  height: '3.1rem',
  verticalAlign: 'middle',
  fontSize: '1.5rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ExploringLinks = () => (
  <Row spacing="2rem" className="test-explore-links">
    <Projects backgroundColor="#1c7960">
      <Background>
        <i className="icon-gdc-projects" />
      </Background>
      &nbsp; <span style={{ verticalAlign: 'middle' }}>Projects</span>
    </Projects>
    <Cohort backgroundColor="#753685">
      <Background>
        <i className="icon-gdc-data" />
      </Background>
      &nbsp; <span style={{ verticalAlign: 'middle' }}>Exploration</span>
    </Cohort>
    <Analysis backgroundColor="#6668c3">
      <Background>
        <AnalysisIcon />
      </Background>
      &nbsp; <span style={{ verticalAlign: 'middle' }}>Analysis</span>
    </Analysis>
    <Repository backgroundColor="rgb(20, 137, 204)">
      <Background>
        <i className="fa fa-database" />
      </Background>
      &nbsp; <span style={{ verticalAlign: 'middle' }}>Repository</span>
    </Repository>
  </Row>
);

export default ExploringLinks;
