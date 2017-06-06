import React from 'react';
import _ from 'lodash';
import { ExternalLink } from '@ncigdc/uikit/Links';
import Wrapper from './LinkWrapper';

export default ({ width }) => (
  <Wrapper>
    <ExternalLink
      hasExternalIcon={false}
      title="GDC Legacy Archive"
      href="https://portal.gdc.cancer.gov/legacy-archive"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <span
        className="icon icon-gdc-legacy-archive"
        style={{ fontSize: width, marginBottom: '5px' }}
      >
        {_.range(0, 11).map(x => <span key={x} className={`path${x}`} />)}
      </span>
      <p>Legacy Archive</p>
    </ExternalLink>
  </Wrapper>
);
