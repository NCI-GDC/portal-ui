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
    ({ project, case: cases, file }) =>
      !project.hits || !cases.hits || !file.hits,
    renderComponent(() => <div>No data found.</div>),
  ),
  connect(state => ({
    dataRelease: state.versionInfo.dataRelease,
  })),
)(props => (
  <span>
    <Row style={{ padding: '2rem', alignItems: 'baseline' }}>
      <div style={{ fontSize: '2.3rem', color: 'rgb(70, 70, 70)' }}>
        Data Portal Summary
      </div>
      <div
        style={{
          fontSize: '1.3rem',
          color: 'rgb(37, 97, 122)',
          marginLeft: '2rem',
        }}
      >
        <a
          className="test-release"
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes/"
        >
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
              style={{ color: '#01b987', fontSize: '3rem' }}
              className="icon-gdc-projects project-icon"
            />
            <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
              <ProjectsCount hits={props.project.hits} />
            </span>
          </Row>
        </CountBox>
        <CountBox>
          <Title className="test-primary-sites-label">Primary Sites</Title>
          <Row>
            <i
              style={{ color: '#01b987', fontSize: '3rem' }}
              className="icon-gdc-cases data-icon"
            />
            <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
              <PrimarySitesCount aggregations={props.project.aggregations} />
            </span>
          </Row>
        </CountBox>
        <CountBox>
          <Title className="test-cases-label">Cases</Title>
          <Row>
            <i
              style={{ color: '#01b987', fontSize: '3rem' }}
              className="icon-gdc-cases data-icon"
            />
            <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
              <CasesCount hits={props.case.hits} />
            </span>
          </Row>
        </CountBox>
      </Row>
      <Row>
        <CountBox>
          <Title className="test-files-label">Files</Title>
          <Row>
            <i
              style={{ color: '#01b987', fontSize: '3rem' }}
              className="fa fa-file-o data-icon"
            />
            <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
              <FilesCount hits={props.file.hits} />
            </span>
          </Row>
        </CountBox>
        <CountBox>
          <Title className="test-genes-label">Genes</Title>
          <Row>
            <DoubleHelix color="#01b987" width={20} height={35} />
            <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
              <CasesCount
                className="test-genes-count"
                hits={props.gene_centric.hits}
              />
            </span>
          </Row>
        </CountBox>
        <CountBox>
          <Title className="test-mutations-label">Mutations</Title>
          <Row>
            <MutationIcon color="#01b987" width="32px" height="39px" />
            <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
              <FilesCount
                className="test-mutations-count"
                hits={props.ssm_centric.hits}
              />
            </span>
          </Row>
        </CountBox>
      </Row>
    </Column>
  </span>
));

export default PortalSummary;
