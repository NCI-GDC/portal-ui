// @flow
import React from 'react';
import Color from 'color';

import styled from '@ncigdc/theme/styled';
import { Row } from '@ncigdc/uikit/Flex';

import ProjectsLink from './Links/ProjectsLink';
import RepositoryLink from './Links/RepositoryLink';
import ExploreLink from './Links/ExploreLink';

const linkStyle = {
  textDecoration: 'none !important',
  color: 'white !important',
  display: 'inline-block',
  width: '17.75rem',
  padding: '0.5rem 0.5rem',
  textAlign: 'left',
  fontSize: '1.5rem',
  margin: '0rem 0rem',
  marginTop: '1rem',
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

const Icon = styled.i({
  display: 'inline-block',
  backgroundColor: 'rgba(255, 255, 255, 0.35)',
  borderRadius: '0.5rem',
  padding: '0.8rem 1.2rem',
  fontSize: '1.5rem',
});

const ExploringLinks = () => (
  <Row spacing="2rem" className="test-explore-links">
    <Projects backgroundColor="#1c7960">
      <Icon className="icon-gdc-projects" />
      &nbsp; <span>Projects</span>
    </Projects>
    <Cohort backgroundColor="#753685">
      <Icon className="icon-gdc-data" />
      &nbsp; <span>Exploration</span>
    </Cohort>
    <Repository backgroundColor="#6668c3">
      <Icon className="fa fa-database" />
      &nbsp; <span>Repository</span>
    </Repository>
  </Row>
);

export default ExploringLinks;
