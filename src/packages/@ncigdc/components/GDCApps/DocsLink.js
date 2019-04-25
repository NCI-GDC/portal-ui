import React from 'react';
import _ from 'lodash';
import { ExternalLink } from '@ncigdc/uikit/Links';
import Wrapper from './LinkWrapper';

export default ({ width }) => (
  <Wrapper>
    <ExternalLink
      hasExternalIcon={false}
      href="https://docs.gdc.cancer.gov/"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      title="GDC Docs">
      <span
        className="icon icon-gdc-docs"
        style={{
          fontSize: width,
          marginBottom: '5px',
        }}>
        {_.range(0, 15).map(x => <span className={`path${x}`} key={x} />)}
      </span>
      <p>Documentation</p>
    </ExternalLink>
  </Wrapper>
);
