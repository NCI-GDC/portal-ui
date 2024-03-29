// @flow

import React from 'react';
import Color from 'color';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withTheme } from '@ncigdc/theme';
import { ExternalLink as ELink } from '@ncigdc/uikit/Links';
import HomeLink from './Links/HomeLink';

const styles = {
  footer: theme => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 100,
    height: 'auto',
    backgroundColor: theme.greyScale1,
    borderTop: `6px solid ${Color(theme.greyScale1)
      .lighten(2)
      .rgbString()}`,
    borderBottom: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  outerContainer: {
    fontSize: '85.714%',
    padding: '15px 0',
    color: '#97abb6',
    textAlign: 'center',
  },
  innerContainer: {
    margin: '5px auto 0',
    textAlign: 'center',
  },
  link: {
    color: '#c2cfd5',
  },
};

const ExternalLink = ({
  children,
  hasExternalIcon = false,
  style,
  ...props
}) => (
  <ELink
    hasExternalIcon={hasExternalIcon}
    style={{
      ...styles.link,
      ...style,
    }}
    {...props}
    >
    {children}
  </ELink>
);

export default compose(
  connect(state => state.versionInfo),
  withTheme,
)(
  ({
    apiCommitHash,
    apiVersion,
    dataRelease,
    theme,
    uiCommitHash,
    uiVersion,
  }) => (
    <footer
      className="test-footer"
      role="contentinfo"
      style={styles.footer(theme)}
      >
      <div style={styles.outerContainer}>
        <div style={styles.innerContainer}>
          <HomeLink style={styles.link}>Site Home</HomeLink>
          <span> | </span>
          <ExternalLink href="https://www.cancer.gov/policies">
            Policies
          </ExternalLink>
          <span> | </span>
          <ExternalLink href="https://www.cancer.gov/policies/accessibility">
            Accessibility
          </ExternalLink>
          <span> | </span>
          <ExternalLink href="https://www.cancer.gov/policies/foia">
            FOIA
          </ExternalLink>
          <span> | </span>
          <ExternalLink href="https://www.hhs.gov/vulnerability-disclosure-policy/index.html">
            HHS Vulnerability Disclosure
          </ExternalLink>
          <span> | </span>
          <ExternalLink href="https://gdc.cancer.gov/support">
            Support
          </ExternalLink>
        </div>
        <div style={styles.innerContainer}>
          <ExternalLink href="https://www.hhs.gov/">
            U.S. Department of Health and Human Services
          </ExternalLink>
          <span> | </span>
          <ExternalLink href="https://www.nih.gov/">
            National Institutes of Health
          </ExternalLink>
          <span> | </span>
          <ExternalLink href="https://www.cancer.gov/">
            National Cancer Institute
          </ExternalLink>
          <span> | </span>
          <ExternalLink href="https://www.usa.gov/">USA.gov</ExternalLink>
        </div>
        <div style={styles.innerContainer}>
          NIH... Turning Discovery Into Health ®
        </div>
        <div style={styles.innerContainer}>
          <span title={`UI version: ${__VERSION__}${uiVersion ? `, tags: ${uiVersion}` : ''}`}>
            {`UI v${__VERSION__}${uiCommitHash ? ` @ ${uiCommitHash.slice(0, 8)}` : ''}`}
          </span>

          {', '}

          <span title={`API version: ${apiVersion}`}>
            {`API v${apiVersion}${apiCommitHash ? ` @ ${apiCommitHash.slice(0, 8)}` : ''}`}
          </span>

          {', '}

          <span>
            <ExternalLink href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes/">
              {dataRelease}
            </ExternalLink>
          </span>
        </div>
      </div>
    </footer>
  ),
);
