// @flow

// Vendor
import React from 'react';
import { Link } from 'react-router';
import Color from 'color';
import { css } from 'glamor';

// Custom
import { Row, Column } from '@ncigdc/uikit/Flex';
import { withTheme } from '@ncigdc/theme';
import { center } from '@ncigdc/theme/mixins';
import logo from '@ncigdc/theme/images/NIH-GDC-Legacy-Archive.svg';
import activePortalLogo from '@ncigdc/theme/images/GDC-App-data-portal.svg';
import Nav from './Nav';

/*----------------------------------------------------------------------------*/

const styles = {
  header: theme => ({
    borderTop: `6px solid ${theme.primary}`,
  }),
  top: {
    background: 'linear-gradient(to bottom, #fefefe 0%, #c7c7c7 100%)',
    padding: '15px 0',
    height: '90px',
  },
  copy: {
    fontSize: '1.2rem',
  },
  logo: {
    minWidth: '275px',
    margin: '0 15px',
  },
  activePortalLink: theme => css({
    backgroundColor: theme.primary,
    padding: '7px',
    color: '#fff !important',
    borderRadius: '5px',
    margin: '0 2rem 0 auto',
    display: 'flex',
    fontSize: '1.5rem',
    transition: 'background-color 0.2s ease',
    textDecoration: 'none !important',
    ':hover': {
      color: '#fff',
      textDecoration: 'none',
      backgroundColor: Color(theme.primary)
        .lighten(0.5)
        .rgbString(),
    },
  }),
  activePortalLogo: {
    height: '40px',
    width: '4rem',
    textIndent: '-10000px',
    marginRight: '15px',
    display: 'inline-block',
  },
};

const Header = ({ theme }) => (
  <Column style={styles.header(theme)}>
    <Row style={styles.top}>
      <Row flex="9">
        <Link style={styles.logo} to="/">
          <img alt="GDC Data Portal" src={logo} />
        </Link>
        <span style={styles.copy}>
          The legacy data is the original data that uses the old genome build
          hg19 as produced by the original submitter. The legacy data is not
          actively being updated in any way. Users should migrate to the
          harmonized data.
          <br />
          Please visit the
          {' '}
          <a href="https://portal.gdc.cancer.gov/">GDC Data Portal</a>
          .
        </span>
      </Row>
      <Row flex="3" style={center}>
        <a
          className={styles.activePortalLink(theme)}
          href="https://portal.gdc.cancer.gov/">
          <img
            alt="GDC Data Portal"
            src={activePortalLogo}
            style={styles.activePortalLogo} />
          <Column>
            <Row>Launch the</Row>
            <Row>
              <strong>GDC Data Portal</strong>
            </Row>
          </Column>
        </a>
      </Row>
    </Row>
    <Nav />
  </Column>
);

/*----------------------------------------------------------------------------*/

export default withTheme(Header);
