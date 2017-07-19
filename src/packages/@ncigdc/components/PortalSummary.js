// @flow

import React from 'react';

import styled from '@ncigdc/theme/styled';
import { zDepth1 } from '@ncigdc/theme/mixins';
import DoubleHelix from '@ncigdc/theme/icons/DoubleHelix';
import MutationIcon from '@ncigdc/theme/icons/Mutation';

import ProjectsCount from '@ncigdc/components/ProjectsCount';
import PrimarySitesCount from '@ncigdc/components/PrimarySitesCount';
import CasesCount from '@ncigdc/components/CasesCount';
import FilesCount from '@ncigdc/components/FilesCount';

import { Row, Column } from '@ncigdc/uikit/Flex';

const Container = styled(Column, {
  ...zDepth1,
  marginTop: '2rem',
  backgroundColor: 'white',
  borderTop: '3px solid rgb(37, 208, 182)',
});

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

type TProps = {
  dataRelease: string,
  projectsCountData: Object,
  primarySitesCountData: Object,
  casesCountData: Object,
  filesCountData: Object,
  genesCountData: Object,
  ssmsCountData: Object,
};
const PortalSummary = (props: TProps) =>
  <Container className="test-portal-summary">
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
          <Title>Projects</Title>
          <Row>
            <i
              style={{ color: '#01b987', fontSize: '3rem' }}
              className="icon-gdc-projects project-icon"
            />
            <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
              <ProjectsCount hits={props.projectsCountData} />
            </span>
          </Row>
        </CountBox>
        <CountBox>
          <Title>Primary Sites</Title>
          <Row>
            <i
              style={{ color: '#01b987', fontSize: '3rem' }}
              className="icon-gdc-cases data-icon"
            />
            <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
              <PrimarySitesCount aggregations={props.primarySitesCountData} />
            </span>
          </Row>
        </CountBox>
        <CountBox>
          <Title>Cases</Title>
          <Row>
            <i
              style={{ color: '#01b987', fontSize: '3rem' }}
              className="icon-gdc-cases data-icon"
            />
            <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
              <CasesCount hits={props.casesCountData} />
            </span>
          </Row>
        </CountBox>
      </Row>
      <Row>
        <CountBox>
          <Title>Files</Title>
          <Row>
            <i
              style={{ color: '#01b987', fontSize: '3rem' }}
              className="fa fa-file-o data-icon"
            />
            <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
              <FilesCount hits={props.filesCountData} />
            </span>
          </Row>
        </CountBox>
        <CountBox>
          <Title>Genes</Title>
          <Row>
            <DoubleHelix color="#01b987" width={20} height={35} />
            <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
              <CasesCount
                className="test-genes-count"
                hits={props.genesCountData}
              />
            </span>
          </Row>
        </CountBox>
        <CountBox>
          <Title>Mutations</Title>
          <Row>
            <MutationIcon color="#01b987" width="32px" height="39px" />
            <span style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }}>
              <FilesCount
                className="test-mutations-count"
                hits={props.ssmsCountData}
              />
            </span>
          </Row>
        </CountBox>
      </Row>
    </Column>
  </Container>;

export default PortalSummary;
