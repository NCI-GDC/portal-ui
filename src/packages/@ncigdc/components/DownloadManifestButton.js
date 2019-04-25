import React from 'react';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import DownloadButton from '@ncigdc/components/DownloadButton';

export default ({
  fileCount,
  filters,
  style,
}: {
  fileCount: Number,
  filters: Object,
  style?: Object
}) => {
  return (
    <Tooltip
      Component={(
        <div style={{ maxWidth: 250 }}>
          Download a manifest for use with the GDC Data Transfer Tool. The GDC
          Data Transfer Tool is recommended for transferring large volumes of
          data.
        </div>
      )}
      style={style}>
      <DownloadButton
        activeText="Downloading"
        className="test-download-manifest"
        disabled={!fileCount}
        endpoint="files"
        filters={filters}
        inactiveText="Manifest"
        returnType="manifest"
        size={fileCount} />
    </Tooltip>
  );
};
