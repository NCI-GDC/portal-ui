import React from 'react';
import { ExternalLink } from '@ncigdc/uikit/Links';
import websiteImg from '@ncigdc/theme/images/GDC-App-website-blue.svg';
import Wrapper from './LinkWrapper';

export default ({ width }) => (
  <Wrapper>
    <ExternalLink
      hasExternalIcon={false}
      title="GDC Website"
      href="https://gdc.cancer.gov/"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <img
        style={{ width }}
        src={websiteImg}
        className="icon icon-gdc-portal home"
        alt="GDC Website"
      />
      <p>Website</p>
    </ExternalLink>
  </Wrapper>
);
