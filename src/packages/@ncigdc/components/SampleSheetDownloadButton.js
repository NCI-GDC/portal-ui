// @flow
import React from 'react';

import timestamp from '@ncigdc/utils/timestamp';
import DownloadButton from '@ncigdc/components/DownloadButton';
import { TCartFile } from '@ncigdc/dux/cart';

const SampleSheetDownloadButton = ({
  files,
}: {
  files: { files: Array<TCartFile> },
}) => (
  <DownloadButton
    activeText="Downloading"
    endpoint="files"
    extraParams={{
      tsv_format: 'sample-sheet',
    }}
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
    filename={`gdc_sample_sheet.${timestamp()}.tsv`}
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
    format="tsv"
    inactiveText="Sample Sheet"
    size={files.files.length}
    style={{ marginRight: '1em' }} />
);

export default SampleSheetDownloadButton;
