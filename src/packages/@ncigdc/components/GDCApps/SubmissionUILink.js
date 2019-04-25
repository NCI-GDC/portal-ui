import React from 'react';
import _ from 'lodash';
import { ExternalLink } from '@ncigdc/uikit/Links';
import Wrapper from './LinkWrapper';

export default ({ width }) => (
  <Wrapper>
    <ExternalLink
      hasExternalIcon={false}
      href="https://portal.gdc.cancer.gov/submission/"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      title="GDC Submission Portal">
      <span
        className="icon icon-gdc-submission-portal"
        style={{
          fontSize: width,
          marginBottom: '5px',
        }}>
        {_.range(0, 11).map(x => <span className={`path${x}`} key={x} />)}
      </span>
      <p>Data Submission Portal</p>
    </ExternalLink>
  </Wrapper>
);
