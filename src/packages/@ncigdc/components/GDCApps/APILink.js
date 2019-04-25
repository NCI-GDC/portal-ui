import React from 'react';
import _ from 'lodash';
import { ExternalLink } from '@ncigdc/uikit/Links';
import Wrapper from './LinkWrapper';

export default ({ width }) => (
  <Wrapper>
    <ExternalLink
      hasExternalIcon={false}
      href="https://gdc.cancer.gov/developers/gdc-application-programming-interface-api"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <span
        className="icon icon-gdc-portal-api"
        style={{
          fontSize: width,
          marginBottom: '5px',
        }}>
        {_.range(0, 11).map(x => <span className={`path${x}`} key={x} />)}
      </span>
      <p>API</p>
    </ExternalLink>
  </Wrapper>
);
