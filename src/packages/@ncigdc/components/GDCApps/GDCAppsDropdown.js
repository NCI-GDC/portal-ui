// @flow

import React from 'react';
import Dropdown from '@ncigdc/uikit/Dropdown';
import styled from '@ncigdc/theme/styled';
import AppLink from '@ncigdc/components/GDCApps/AppLink';

import dataPortalImg from '@ncigdc/theme/images/GDC-App-data-portal-blue.svg';
import publicationsImg from '@ncigdc/theme/images/GDC-App-publications.svg';
import websiteImg from '@ncigdc/theme/images/GDC-App-website-blue.svg';

import Row from '@ncigdc/uikit/Flex/Row';

import './GDCAppsDropdown.css';

const DropDownButton = styled.span({
  ':hover': {
    backgroundColor: '#dedddd',
    color: '#333',
    cursor: 'pointer',
  },
  display: 'block',
  padding: '15px 13px',
});

const DropdownContent = styled(Row, {
  justifyContent: 'space-between',
  position: 'absolute',
  textAlign: 'center',
  width: 'initial',
  zIndex: 1,
});

const Container = styled(Row, {
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  padding: '1.5rem 0 0',
  width: '31rem',
});

const BUTTON_WIDTH = 26;

const GDCAppsDropdown = () => (
  <Dropdown
    button={(
      <DropDownButton>
        <i className="icon-gdc-apps-menu" />
        <span
          className="header-hidden-sm header-hidden-md"
          data-translate
          >
          GDC Apps
        </span>
      </DropDownButton>
    )}
    dropdownClassName="gdc-apps-menu-container"
    dropdownStyle={{
      borderBottomLeftRadius: '5px',
      borderBottomRightRadius: '5px',
      marginTop: '15px',
    }}
    style={{
      border: 'none',
      color: '#767676',
      display: 'block',
      margin: 0,
    }}
    >
    <DropdownContent>
      <Container>
        <AppLink
          appName="portal home"
          description="Data Portal"
          href="https://portal.gdc.cancer.gov"
          imgSrc={dataPortalImg}
          imgWidth={BUTTON_WIDTH}
          title="GDC Data Portal"
          width="40%"
          />

        <AppLink
          appName="portal home"
          description="Website"
          href="https://gdc.cancer.gov"
          imgSrc={websiteImg}
          imgWidth={BUTTON_WIDTH}
          title="GDC Website"
          width="55%"
          />

        <AppLink
          appName="portal-api"
          description="API"
          drawnRange={11}
          href="https://gdc.cancer.gov/developers/gdc-application-programming-interface-api"
          imgWidth={BUTTON_WIDTH}
          title="API"
          width="40%"
          />

        <AppLink
          appName="data-transfer-tool"
          description="Data Transfer Tool"
          drawnRange={9}
          href="https://docs.gdc.cancer.gov/Data_Transfer_Tool/Users_Guide/Getting_Started/"
          imgWidth={BUTTON_WIDTH}
          title="GDC Data Transfer Tool"
          width="55%"
          />

        <AppLink
          appName="docs"
          description="Documentation"
          drawnRange={15}
          href="https://docs.gdc.cancer.gov"
          imgWidth={BUTTON_WIDTH}
          title="GDC Docs"
          width="40%"
          />

        <AppLink
          appName="submission-portal"
          description="Data Submission Portal"
          drawnRange={11}
          href="https://portal.gdc.cancer.gov/submission"
          imgWidth={BUTTON_WIDTH}
          title="GDC Data Submission Portal"
          width="55%"
          />

        <AppLink
          appName="legacy-archive"
          description="Legacy Archive"
          drawnRange={11}
          href="https://portal.gdc.cancer.gov/legacy-archive"
          imgWidth={BUTTON_WIDTH}
          title="GDC Legacy Archive"
          width="40%"
          />

        <AppLink
          appName="publications"
          description="Publications"
          href="https://gdc.cancer.gov/about-data/publications"
          imgSrc={publicationsImg}
          imgWidth={BUTTON_WIDTH}
          title="GDC Publications"
          width="55%"
          />
      </Container>
    </DropdownContent>
  </Dropdown>
);

export default GDCAppsDropdown;
