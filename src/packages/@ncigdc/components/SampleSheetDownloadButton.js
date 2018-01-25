// @flow
import React from 'react';

import timestamp from '@ncigdc/utils/timestamp';
import DownloadButton from '@ncigdc/components/DownloadButton';
import type { TCartFile } from '@ncigdc/dux/cart';

const SampleSheetDownloadButton = ({
  files,
}: {
  files: { files: Array<TCartFile> },
}) => (
  <DownloadButton
    endpoint="files"
    style={{ marginRight: '1em' }}
    size={files.files.length}
    filename={`gdc_sample_sheet_${timestamp()}.tsv`}
    activeText="Downloading"
    inactiveText="Sample Sheet"
    format="tsv"
    fields={[
      'file_id',
      'file_name',
      'data_category',
      'data_type',
      'cases.project.project_id',
      'cases.submitter_id',
      'cases.samples.submitter_id',
      'cases.samples.sample_type',
    ]}
    extraParams={{
      tsv_format: 'sample-sheet',
    }}
    filters={{
      content: [
        {
          content: {
            field: 'files.file_id',
            value: files.files.map(file => file.file_id),
          },
          op: 'in',
        },
      ],
      op: 'and',
    }}
  />
);

export default SampleSheetDownloadButton;
