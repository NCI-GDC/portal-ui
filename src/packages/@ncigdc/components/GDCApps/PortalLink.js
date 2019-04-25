import React from 'react';
import { ExternalLink } from '@ncigdc/uikit/Links';
import dataPortalImg from '@ncigdc/theme/images/GDC-App-data-portal-blue.svg';
import Wrapper from './LinkWrapper';

export default ({ width }) => (
  <Wrapper>
    <ExternalLink
      hasExternalIcon={false}
      href="https://portal.gdc.cancer.gov/"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      title="Data Portal">
      <img
        alt="GDC Data Portal"
        className="icon icon-gdc-portal home"
        src={dataPortalImg}
        style={{ width }} />
      <p>Data Portal</p>
    </ExternalLink>
  </Wrapper>
);
