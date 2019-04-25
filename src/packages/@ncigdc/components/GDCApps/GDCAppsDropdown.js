// @flow

import React from 'react';
import Dropdown from '@ncigdc/uikit/Dropdown';
import styled from '@ncigdc/theme/styled';
import PortalLink from '@ncigdc/components/GDCApps/PortalLink';
import APILink from '@ncigdc/components/GDCApps/APILink';
import WebsiteLink from '@ncigdc/components/GDCApps/WebsiteLink';
import DTTLink from '@ncigdc/components/GDCApps/DTTLink';
import SubmissionUILink from '@ncigdc/components/GDCApps/SubmissionUILink';
import DocsLink from '@ncigdc/components/GDCApps/DocsLink';
import LegacyLink from '@ncigdc/components/GDCApps/LegacyLink';

import Row from '@ncigdc/uikit/Flex/Row';
import Column from '@ncigdc/uikit/Flex/Column';

import './GDCAppsDropdown.css';

const DropDownButton = styled.span({
  padding: '15px 13px',
  display: 'block',
  ':hover': {
    cursor: 'pointer',
    color: '#333',
    backgroundColor: '#dedddd',
  },
});

const DropdownContent = styled(Row, {
  position: 'absolute',
  zIndex: 1,
  textAlign: 'center',
  justifyContent: 'space-between',
  width: 'initial',
});

const BUTTON_WIDTH = 26;

const GDCAppsDropdown = () => (
  <Dropdown
    dropdownClassName="gdc-apps-menu-container"
    style={{
      margin: 0,
      border: 'none',
      color: '#767676',
      display: 'block',
    }}
    dropdownStyle={{
      marginTop: '15px',
      borderBottomLeftRadius: '5px',
      borderBottomRightRadius: '5px',
    }}
    button={
      <DropDownButton>
        <i className="icon-gdc-apps-menu" style={{ paddingRight: '4px' }} />
        <span className="header-hidden-sm header-hidden-md" data-translate>
          GDC Apps
        </span>
      </DropDownButton>
    }
  >
    <DropdownContent>
      <Column>
        <PortalLink width={BUTTON_WIDTH} />
        <APILink width={BUTTON_WIDTH} />
        <DocsLink width={BUTTON_WIDTH} />
        <LegacyLink width={BUTTON_WIDTH} />
      </Column>
      <Column>
        <WebsiteLink width={BUTTON_WIDTH} />
        <DTTLink width={BUTTON_WIDTH} />
        <SubmissionUILink width={BUTTON_WIDTH} />
      </Column>
    </DropdownContent>
  </Dropdown>
);

export default GDCAppsDropdown;
