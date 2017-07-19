// @flow

import React from 'react';
import PropTypes from 'prop-types';

import Card from '@ncigdc/uikit/Card';

/*----------------------------------------------------------------------------*/

const title = <span>How to download files in my Cart?</span>;

const HowToDownload = ({ style = {} }) =>
  <Card style={style} title={title} className="test-how-to-download">
    <div style={{ padding: '1rem' }}>
      <strong>Download Manifest:</strong>
      <br />
      Download a manifest for use with the
      <a
        style={{ marginLeft: '0.4rem' }}
        href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
      >
        GDC Data Transfer Tool
      </a>.
      The GDC Data Transfer Tool is recommended for transferring large volumes
      of data.
      <br />
      <br />
      <strong>Download Cart:</strong>
      <br />
      Download Files in your Cart directly from the Web Browser.
    </div>
  </Card>;

HowToDownload.propTypes = {
  style: PropTypes.object,
};

/*----------------------------------------------------------------------------*/

export default HowToDownload;
