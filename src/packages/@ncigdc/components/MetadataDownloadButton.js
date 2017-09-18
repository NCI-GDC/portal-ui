// @flow
import React from 'react';

import DownloadButton from '@ncigdc/components/DownloadButton';

const MetadataDropdownButton = ({ files }) => (
  <DownloadButton
    endpoint="files"
    size={files.files.length}
    filename="metadata.cart"
    activeText="Downloading"
    inactiveText="Metadata"
    fields={[
      'state',
      'access',
      'md5sum',
      'data_format',
      'data_type',
      'data_category',
      'file_name',
      'file_size',
      'file_id',
      'platform',
      'experimental_strategy',
      'center.short_name',
      'cases.case_id',
      'cases.project.project_id',
      'annotations.annotation_id',
      'annotations.entity_id',
      'tags',
      'submitter_id',
      'archive.archive_id',
      'archive.submitter_id',
      'archive.revision',
      'associated_entities.entity_id',
      'associated_entities.entity_type',
      'associated_entities.case_id',
      'analysis.analysis_id',
      'analysis.workflow_type',
      'analysis.updated_datetime',
      'analysis.input_files.file_id',
      'analysis.metadata.read_groups.read_group_id',
      'analysis.metadata.read_groups.is_paired_end',
      'analysis.metadata.read_groups.read_length',
      'analysis.metadata.read_groups.library_name',
      'analysis.metadata.read_groups.sequencing_center',
      'analysis.metadata.read_groups.sequencing_date',
      'downstream_analyses.output_files.access',
      'downstream_analyses.output_files.file_id',
      'downstream_analyses.output_files.file_name',
      'downstream_analyses.output_files.data_category',
      'downstream_analyses.output_files.data_type',
      'downstream_analyses.output_files.data_format',
      'downstream_analyses.workflow_type',
      'downstream_analyses.output_files.file_size',
      'index_files.file_id',
    ]}
    extraParams={{
      expand: [
        'metadata_files',
        'annotations',
        'archive',
        'associated_entities',
        'center',
        'analysis',
        'analysis.input_files',
        'analysis.metadata',
        'analysis.metadata_files',
        'analysis.downstream_analyses',
        'analysis.downstream_analyses.output_files',
        'reference_genome',
        'index_file',
        'cases',
        'cases.demographic',
        'cases.diagnoses',
        'cases.diagnoses.treatments',
        'cases.family_histories',
        'cases.exposures',
        'cases.samples',
        'cases.samples.portions',
        'cases.samples.portions.analytes',
        'cases.samples.portions.analytes.aliquots',
        'cases.samples.portions.analytes.aliquots.annotations',
        'cases.samples.portions.analytes.annotations',
        'cases.samples.portions.submitter_id',
        'cases.samples.portions.slides',
        'cases.samples.portions.annotations',
        'cases.samples.portions.center',
      ],
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

export default MetadataDropdownButton;
