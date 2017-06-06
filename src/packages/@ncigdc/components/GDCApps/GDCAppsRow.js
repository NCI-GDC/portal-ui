// @flow
import React from 'react';
import styled from '@ncigdc/theme/styled';
import PortalLink from '@ncigdc/components/GDCApps/PortalLink';
import APILink from '@ncigdc/components/GDCApps/APILink';
import WebsiteLink from '@ncigdc/components/GDCApps/WebsiteLink';
import DTTLink from '@ncigdc/components/GDCApps/DTTLink';
import SubmissionUILink from '@ncigdc/components/GDCApps/SubmissionUILink';
import DocsLink from '@ncigdc/components/GDCApps/DocsLink';
import LegacyLink from '@ncigdc/components/GDCApps/LegacyLink';

import { Row } from '@ncigdc/uikit/Flex';

const Container = styled(Row, {
  margin: '2rem 0',
  justifyContent: 'space-around',
  width: '100vw',
  padding: '0 14rem',
});

const GDCAppsRow = () => (
  <Container>
    <PortalLink width={35} />
    <WebsiteLink width={35} />
    <DTTLink width={29} />
    <APILink width={29} />
    <SubmissionUILink width={29} />
    <DocsLink width={29} />
    <LegacyLink width={29} />
  </Container>
);

export default GDCAppsRow;
