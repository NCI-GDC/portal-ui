import React from 'react';
import _ from 'lodash';
import { ExternalLink } from '@ncigdc/uikit/Links';
import Wrapper from './LinkWrapper';

export default ({ width }) => (
  <Wrapper>
    <ExternalLink
      hasExternalIcon={false}
      title="GDC Data Transfer Tool"
      href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <span
        className="icon icon-gdc-data-transer-tool"
        style={{ fontSize: width, marginBottom: '5px' }}
      >
        {_.range(0, 9).map(x => <span key={x} className={`path${x}`} />)}
      </span>
      <p>Data Transfer Tool</p>
    </ExternalLink>
  </Wrapper>
);
