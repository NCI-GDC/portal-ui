import React from 'react';
import { range } from 'lodash';
import { ExternalLink } from '@ncigdc/uikit/Links';
import Wrapper from './LinkWrapper';

const AppLink = ({
  appName,
  description,
  drawnRange,
  href,
  imgSrc,
  imgWidth,
  title,
  width,
}) => (
  <Wrapper style={{ flexBasis: width || 'auto' }}>
    <ExternalLink
      hasExternalIcon={false}
      href={href}
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 1.5rem',
      }}
      title={title || description || appName}
      >

      {imgSrc && (
        <img
          alt={title || description || appName}
          className={`icon icon-gdc-${appName}`}
          src={imgSrc}
          style={{ imgWidth }}
          />
      )}

      {drawnRange && (
        <span
          className={`icon icon-gdc-${appName}`}
          style={{
            fontSize: imgWidth,
            marginBottom: '5px',
          }}
          >
          {range(0, drawnRange).map(n => <span className={`path${n}`} key={n} />)}
        </span>
      )}
      <p>{description}</p>
    </ExternalLink>
  </Wrapper>
);

export default AppLink;
