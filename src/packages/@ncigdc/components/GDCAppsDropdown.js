// @flow

import React from "react";
import _ from "lodash";

import Dropdown from "@ncigdc/uikit/Dropdown";
import { ExternalLink } from "@ncigdc/uikit/Links";

import styled from "@ncigdc/theme/styled";
import dataPortalImg from "@ncigdc/theme/images/GDC-App-data-portal-blue.svg";
import websiteImg from "@ncigdc/theme/images/GDC-App-website-blue.svg";

import Row from "@ncigdc/uikit/Flex/Row";
import Column from "@ncigdc/uikit/Flex/Column";

import "./GDCAppsDropdown.css";

const DropDownButton = styled.span({
  padding: "15px 13px",
  display: "block",
  ":hover": {
    cursor: "pointer",
    color: "#333",
    backgroundColor: "#dedddd"
  }
});

const DropdownContent = styled(Row, {
  position: "absolute",
  zIndex: 1,
  textAlign: "center",
  justifyContent: "space-between",
  width: "initial"
});

const DropdownItem = styled(Row, {
  whiteSpace: "nowrap",
  display: "inline !important",
  padding: "0.5rem",
  margin: "0.25rem",
  transition: "background 0.25s ease-in-out",
  fontWeight: "normal",
  backgroundColor: ({ theme, active }) =>
    active ? theme.greyScale6 : "inherit",
  " a": {
    color: "#333",
    fontWeight: "normal",
    fontSize: "small",
    display: "block"
  },
  " .icon": {
    fontSize: "2rem"
  },
  ":hover": {
    backgroundColor: "#ededed"
  }
});

const GDCAppsDropdown = () => (
  <Dropdown
    dropdownClassName="gdc-apps-menu-container"
    style={{
      margin: 0,
      border: "none",
      color: "#767676",
      display: "block"
    }}
    dropdownStyle={{
      marginTop: "15px",
      borderBottomLeftRadius: "5px",
      borderBottomRightRadius: "5px"
    }}
    button={
      <DropDownButton>
        <i className="icon-gdc-apps-menu" style={{ paddingRight: "4px" }} />
        <span className="hidden-md hidden-sm" data-translate>GDC Apps</span>
      </DropDownButton>
    }
  >
    <DropdownContent>
      <Column>
        <DropdownItem active>
          <ExternalLink
            hasExternalIcon={false}
            href="https://portal.gdc.cancer.gov/"
            title="Data Portal"
          >
            <img
              style={{ width: "26px" }}
              src={dataPortalImg}
              className="icon icon-gdc-portal home"
              alt="GDC Data Portal"
            />
            <p>Data Portal</p>
          </ExternalLink>
        </DropdownItem>
        <DropdownItem>
          <ExternalLink
            hasExternalIcon={false}
            href="https://gdc.cancer.gov/developers/gdc-application-programming-interface-api"
          >
            <span className="icon icon-gdc-portal-api">
              {_.range(0, 11).map(x => <span key={x} className={`path${x}`} />)}
            </span>
            <p>process.env.REACT_APP_API</p>
          </ExternalLink>
        </DropdownItem>
        <DropdownItem>
          <ExternalLink
            hasExternalIcon={false}
            title="GDC Docs"
            href="https://docs.gdc.cancer.gov/"
          >
            <span className="icon icon-gdc-docs">
              {_.range(0, 15).map(x => <span key={x} className={`path${x}`} />)}
            </span>
            <p>Documentation</p>
          </ExternalLink>
        </DropdownItem>
        <DropdownItem>
          <ExternalLink
            hasExternalIcon={false}
            title="GDC Legacy Archive"
            href="https://portal.gdc.cancer.gov/legacy-archive"
          >
            <span className="icon icon-gdc-legacy-archive">
              {_.range(0, 11).map(x => <span key={x} className={`path${x}`} />)}
            </span>
            <p>Legacy Archive</p>
          </ExternalLink>
        </DropdownItem>
      </Column>
      <Column>
        <DropdownItem>
          <ExternalLink
            hasExternalIcon={false}
            title="GDC Website"
            href="https://gdc.cancer.gov/"
          >
            <img
              style={{ width: "26px" }}
              src={websiteImg}
              className="icon icon-gdc-portal home"
              alt="GDC Website"
            />
            <p>Website</p>
          </ExternalLink>
        </DropdownItem>
        <DropdownItem>
          <ExternalLink
            hasExternalIcon={false}
            title="GDC Data Transfer Tool"
            href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
          >
            <span className="icon icon-gdc-data-transer-tool">
              {_.range(0, 9).map(x => <span key={x} className={`path${x}`} />)}
            </span>
            <p>Data Transfer Tool</p>
          </ExternalLink>
        </DropdownItem>
        <DropdownItem>
          <ExternalLink
            hasExternalIcon={false}
            title="GDC Submission Portal"
            href="https://portal.gdc.cancer.gov/submission/"
          >
            <span className="icon icon-gdc-submission-portal">
              {_.range(0, 11).map(x => <span key={x} className={`path${x}`} />)}
            </span>
            <p>Data Submission Portal</p>
          </ExternalLink>
        </DropdownItem>
      </Column>
    </DropdownContent>
  </Dropdown>
);

export default GDCAppsDropdown;
