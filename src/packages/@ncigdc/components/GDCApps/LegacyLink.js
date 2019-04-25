import React from 'react';
import _ from 'lodash';
import { ExternalLink } from '@ncigdc/uikit/Links';
import Wrapper from './LinkWrapper';

export default ({ width }) => (
  <Wrapper>
    <ExternalLink
      hasExternalIcon={false}
      href="https://portal.gdc.cancer.gov/legacy-archive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      title="GDC Legacy Archive">
      <span
        className="icon icon-gdc-legacy-archive"
        style={{
          fontSize: width,
          marginBottom: '5px',
        }}>
        {_.range(0, 11).map(x => <span className={`path${x}`} key={x} />)}
      </span>
      <p>Legacy Archive</p>
    </ExternalLink>
  </Wrapper>
);
