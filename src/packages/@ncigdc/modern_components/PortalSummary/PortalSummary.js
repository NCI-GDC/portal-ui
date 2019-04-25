// @flow

import React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import styled from '@ncigdc/theme/styled';
import DoubleHelix from '@ncigdc/theme/icons/DoubleHelix';
import MutationIcon from '@ncigdc/theme/icons/Mutation';
import ProjectsCount from '@ncigdc/components/ProjectsCount';
import PrimarySitesCount from '@ncigdc/components/PrimarySitesCount';
import CasesCount from '@ncigdc/components/CasesCount';
import FilesCount from '@ncigdc/components/FilesCount';

import { Row, Column } from '@ncigdc/uikit/Flex';

const CountBox = styled(Column, {
  padding: '1.5rem',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const Title = styled(Row, {
  justifyContent: 'center',
  textTransform: 'uppercase',
  marginBottom: '0.5rem',
});

const PortalSummary = compose(
  branch(
    ({ viewer }) => !viewer.projects.hits ||
      !viewer.repository.cases.hits ||
      !viewer.repository.files.hits,
    renderComponent(() => <div>No data found.</div>),
  ),
  connect(state => ({
    dataRelease: state.versionInfo.dataRelease,
  })),
)(props => (
  <span>
    <Row style={{
      padding: '2rem',
      alignItems: 'baseline',
    }}>
      <div style={{
        fontSize: '2.3rem',
        color: 'rgb(70, 70, 70)',
      }}>
        Data Portal Summary
      </div>
      <div
        style={{
          fontSize: '1.3rem',
          color: 'rgb(37, 97, 122)',
          marginLeft: '2rem',
        }}>
        <a
          className="test-release"
          href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes/"
          rel="noopener noreferrer"
          target="_blank">
          {props.dataRelease}
        </a>
      </div>
    </Row>
    <Column>
      <Row>
        <CountBox>
          <Title className="test-projects-label">Projects</Title>
          <Row>
            <i
              className="icon-gdc-projects project-icon"
              style={{
                color: '#01b987',
                fontSize: '3rem',
              }} />
            <span style={{
              fontSize: '2.5rem',
              marginLeft: '0.5rem',
            }}>
              <ProjectsCount hits={props.viewer.projects.hits} />
            </span>
          </Row>
        </CountBox>
        <CountBox>
          <Title className="test-primary-sites-label">Primary Sites</Title>
          <Row>
            <i
              className="icon-gdc-cases data-icon"
              style={{
                color: '#01b987',
                fontSize: '3rem',
              }} />
            <span style={{
              fontSize: '2.5rem',
              marginLeft: '0.5rem',
            }}>
              <PrimarySitesCount
                aggregations={props.viewer.projects.aggregations} />
            </span>
          </Row>
        </CountBox>
        <CountBox>
          <Title className="test-cases-label">Cases</Title>
          <Row>
            <i
              className="icon-gdc-cases data-icon"
              style={{
                color: '#01b987',
                fontSize: '3rem',
              }} />
            <span style={{
              fontSize: '2.5rem',
              marginLeft: '0.5rem',
            }}>
              <CasesCount hits={props.viewer.repository.cases.hits} />
            </span>
          </Row>
        </CountBox>
      </Row>
      <Row>
        <CountBox>
          <Title className="test-files-label">Files</Title>
          <Row>
            <i
              className="fa fa-file-o data-icon"
              style={{
                color: '#01b987',
                fontSize: '3rem',
              }} />
            <span style={{
              fontSize: '2.5rem',
              marginLeft: '0.5rem',
            }}>
              <FilesCount hits={props.viewer.repository.files.hits} />
            </span>
          </Row>
        </CountBox>
        <CountBox>
          <Title className="test-genes-label">Genes</Title>
          <Row>
            <DoubleHelix color="#01b987" height={35} width={20} />
            <span style={{
              fontSize: '2.5rem',
              marginLeft: '0.5rem',
            }}>
              <CasesCount
                className="test-genes-count"
                hits={props.viewer.explore.genes.hits} />
            </span>
          </Row>
        </CountBox>
        <CountBox>
          <Title className="test-mutations-label">Mutations</Title>
          <Row>
            <MutationIcon color="#01b987" height="39px" width="32px" />
            <span style={{
              fontSize: '2.5rem',
              marginLeft: '0.5rem',
            }}>
              <FilesCount
                className="test-mutations-count"
                hits={props.viewer.explore.ssms.hits} />
            </span>
          </Row>
        </CountBox>
      </Row>
    </Column>
  </span>
));

export default PortalSummary;
