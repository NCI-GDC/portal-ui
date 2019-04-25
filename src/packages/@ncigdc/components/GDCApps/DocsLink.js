import React from 'react';
import _ from 'lodash';
import { ExternalLink } from '@ncigdc/uikit/Links';
import Wrapper from './LinkWrapper';

export default ({ width }) => (
  <Wrapper>
    <ExternalLink
      hasExternalIcon={false}
      title="GDC Docs"
      href="https://docs.gdc.cancer.gov/"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <span
        className="icon icon-gdc-docs"
        style={{ fontSize: width, marginBottom: '5px' }}
      >
        {_.range(0, 15).map(x => <span key={x} className={`path${x}`} />)}
      </span>
      <p>Documentation</p>
    </ExternalLink>
  </Wrapper>
);
