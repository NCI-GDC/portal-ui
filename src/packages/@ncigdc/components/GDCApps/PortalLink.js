import React from 'react';
import { ExternalLink } from '@ncigdc/uikit/Links';
import dataPortalImg from '@ncigdc/theme/images/GDC-App-data-portal-blue.svg';
import Wrapper from './LinkWrapper';

export default ({ width }) => (
  <Wrapper>
    <ExternalLink
      hasExternalIcon={false}
      href="https://portal.gdc.cancer.gov/"
      title="Data Portal"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <img
        style={{ width }}
        src={dataPortalImg}
        className="icon icon-gdc-portal home"
        alt="GDC Data Portal"
      />
      <p>Data Portal</p>
    </ExternalLink>
  </Wrapper>
);
