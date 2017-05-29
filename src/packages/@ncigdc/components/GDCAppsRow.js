// @flow
import React from 'react';
import _ from 'lodash';
import styled from '@ncigdc/theme/styled';
import dataPortalImg from '@ncigdc/theme/images/GDC-App-data-portal-blue.svg';
import websiteImg from '@ncigdc/theme/images/GDC-App-website-blue.svg';

import { Row } from '@ncigdc/uikit/Flex';

const Container = styled(Row, {
  margin: '2rem 0',
  justifyContent: 'space-around',
  width: '100vw',
  padding: '0 14rem',
});

const linkStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textDecoration: 'none',
};

const ActiveApp = styled.span(linkStyle);
const AppLink = styled.a(linkStyle);

const GDCAppsRow = () => (
  <Container>
    <ActiveApp title="Data Portal">
      <img
        width="35px"
        src={dataPortalImg}
        className="icon icon-gdc-portal home"
        alt="GDC Data Portal"
      />
      <p>Data Portal</p>
    </ActiveApp>
    <AppLink
      href="https://gdc.cancer.gov/"
      target="_blank"
      rel="noopener noreferrer"
      title="GDC Website"
    >
      <img
        width="35px"
        src={websiteImg}
        className="icon icon-gdc-portal home"
        alt="GDC Website"
      />
      <p>Website</p>
    </AppLink>
    <AppLink
      href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
      target="_blank"
      rel="noopener noreferrer"
      title="GDC Data Transfer Tool"
    >
      <span
        className="icon icon-gdc-data-transer-tool"
        style={{ fontSize: '29px', marginBottom: '5px' }}
      >
        {_.range(0, 9).map(x => <span key={x} className={`path${x}`} />)}
      </span>
      <p>Data Transfer Tool</p>
    </AppLink>
    <AppLink
      href="https://gdc.cancer.gov/developers/gdc-application-programming-interface-api"
      target="_blank"
      rel="noopener noreferrer"
      title="GDC API"
    >
      <span
        className="icon icon-gdc-portal-api"
        style={{ fontSize: '29px', marginBottom: '5px' }}
      >
        {_.range(0, 11).map(x =>
          <span key={x} className={`path${x}`} />
        )}
      </span>
      <p>API</p>
    </AppLink>
    <AppLink
      href="https://gdc-portal.nci.nih.gov/submission/"
      target="_blank"
      rel="noopener noreferrer"
      title="GDC Submission Portal"
    >
      <span
        className="icon icon-gdc-submission-portal"
        style={{ fontSize: '29px', marginBottom: '5px' }}
      >
        {_.range(0, 11).map(x => <span key={x} className={`path${x}`} />)}
      </span>
      <p>Data Submission Portal</p>
    </AppLink>
    <AppLink
      href="https://gdc-docs.nci.nih.gov/"
      target="_blank"
      rel="noopener noreferrer"
      title="GDC Docs"
    >
      <span
        className="icon icon-gdc-docs"
        style={{ fontSize: '29px', marginBottom: '5px' }}
      >
        {_.range(0, 15).map(x => <span key={x} className={`path${x}`} />)}
      </span>
      <p>Documentation</p>
    </AppLink>
    <AppLink
      href="https://gdc-portal.nci.nih.gov/legacy-archive"
      target="_blank"
      rel="noopener noreferrer"
      title="GDC Legacy Archive"
    >
      <span
        className="icon icon-gdc-legacy-archive"
        style={{ fontSize: '29px', marginBottom: '5px' }}
      >
        {_.range(0, 11).map(x => <span key={x} className={`path${x}`} />)}
      </span>
      <p>Legacy Archive</p>
    </AppLink>
  </Container>
);

export default GDCAppsRow;
