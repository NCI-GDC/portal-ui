import React from 'react';
import { ExternalLink } from '@ncigdc/uikit/Links';
import websiteImg from '@ncigdc/theme/images/GDC-App-website-blue.svg';
import Wrapper from './LinkWrapper';

export default ({ width }) => (
  <Wrapper>
    <ExternalLink
      hasExternalIcon={false}
      href="https://gdc.cancer.gov/"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      title="GDC Website">
      <img
        alt="GDC Website"
        className="icon icon-gdc-portal home"
        src={websiteImg}
        style={{ width }} />
      <p>Website</p>
    </ExternalLink>
  </Wrapper>
);
