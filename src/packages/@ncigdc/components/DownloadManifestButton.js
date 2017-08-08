import React from 'react';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import DownloadButton from '@ncigdc/components/DownloadButton';

export default ({ fileCount, filters, style }) => {
  return (
    <Tooltip
      style={style}
      Component={
        <div style={{ maxWidth: 250 }}>
          Download a manifest for use with the GDC Data Transfer Tool. The GDC
          Data Transfer Tool is recommended for transferring large volumes of
          data.
        </div>
      }
    >
      <DownloadButton
        className="test-download-manifest"
        disabled={!fileCount}
        endpoint="files"
        activeText="Downloading"
        inactiveText="Download Manifest"
        returnType="manifest"
        filters={filters}
        size={fileCount}
      />
    </Tooltip>
  );
};
