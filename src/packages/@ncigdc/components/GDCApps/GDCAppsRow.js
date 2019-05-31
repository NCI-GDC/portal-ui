// @flow
import React from 'react';
import styled from '@ncigdc/theme/styled';
import AppLink from '@ncigdc/components/GDCApps/AppLink';

import dataPortalImg from '@ncigdc/theme/images/GDC-App-data-portal-blue.svg';
import publicationsImg from '@ncigdc/theme/images/GDC-App-publications.svg';
import websiteImg from '@ncigdc/theme/images/GDC-App-website-blue.svg';

import { Row } from '@ncigdc/uikit/Flex';

const Container = styled(Row, {
  justifyContent: 'space-around',
  margin: '2rem 0',
  padding: '0 14rem',
  width: '100vw',
});

const GDCAppsRow = () => (
  <Container>
    <AppLink
      appName="portal home"
      description="Data Portal"
      href="https://portal.gdc.cancer.gov"
      imgSrc={dataPortalImg}
      imgWidth={35}
      title="GDC Data Portal"
      />

    <AppLink
      appName="portal home"
      description="Website"
      href="https://gdc.cancer.gov"
      imgSrc={websiteImg}
      imgWidth={35}
      title="GDC Website"
      />

    <AppLink
      appName="portal-api"
      description="API"
      drawnRange={11}
      href="https://gdc.cancer.gov/developers/gdc-application-programming-interface-api"
      imgWidth={29}
      title="API"
      />

    <AppLink
      appName="data-transfer-tool"
      description="Data Transfer Tool"
      drawnRange={9}
      href="https://docs.gdc.cancer.gov"
      imgWidth={29}
      title="GDC Data Transfer Tool"
      />

    <AppLink
      appName="docs"
      description="Documentation"
      drawnRange={15}
      href="https://docs.gdc.cancer.gov"
      imgWidth={29}
      title="GDC Docs"
      />

    <AppLink
      appName="submission-portal"
      description="Data Submission Portal"
      drawnRange={11}
      href="https://portal.gdc.cancer.gov/submission"
      imgWidth={29}
      title="GDC Data Submission Portal"
      />

    <AppLink
      appName="legacy-archive"
      description="Legacy Archive"
      drawnRange={11}
      href="https://portal.gdc.cancer.gov/legacy-archive"
      imgWidth={29}
      title="GDC Legacy Archive"
      />

    <AppLink
      appName="publications"
      description="Publications"
      href="https://gdc.cancer.gov/about-data/publications"
      imgSrc={publicationsImg}
      imgWidth={29}
      title="GDC Publications"
      />
  </Container>
);

export default GDCAppsRow;
