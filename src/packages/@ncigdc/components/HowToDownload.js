import React from 'react';
import PropTypes from 'prop-types';

import Card from '@ncigdc/uikit/Card';
import ExternalLink from '@ncigdc/uikit/Links/ExternalLink';

/*----------------------------------------------------------------------------*/

const title = <span>How to download files in my Cart?</span>;

const HowToDownload = ({ style = {} }) => (
  <Card className="test-how-to-download" style={style} title={title}>
    <div style={{ padding: '1rem' }}>
      <strong>Download Manifest:</strong>
      <br />
      Download a manifest for use with the
      <a
        href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
        style={{ marginLeft: '0.4rem' }}
        >
        GDC Data Transfer Tool
      </a>
. The GDC Data Transfer Tool is recommended for transferring large
      volumes of data.
      <br />
      <br />
      <strong>Download Cart:</strong>
      <br />
      Download Files in your Cart directly from the Web Browser.
      <br />
      <br />
      <strong>Download Reference Files:</strong>
      <br />
      <span>Download </span>
      <ExternalLink
        hasExternalIcon={false}
        href="https://gdc.cancer.gov/about-data/data-harmonization-and-generation/gdc-reference-files"
        >
        GDC Reference Files
      </ExternalLink>
      <span> for use in your genomic data analysis.</span>
    </div>
  </Card>
);

HowToDownload.propTypes = {
  style: PropTypes.object,
};

/*----------------------------------------------------------------------------*/

export default HowToDownload;
