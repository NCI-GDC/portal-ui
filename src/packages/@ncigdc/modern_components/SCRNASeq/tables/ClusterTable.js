import React from 'react';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { random } from 'lodash';

import data from './tableData';

const ClusterTable = () => {
  const stubHeadings = [
    {
      key: 'cell_barcode',
      title: 'Cell Barcode',
    },
    {
      key: 'read_count',
      title: '# Reads',
    },
    {
      key: 'gene_count',
      title: '# Genes',
    },
    {
      key: 'seurat_cluster',
      title: 'Cluster ID',
    },
  ]
    .map(row => ({
      ...row,
      thStyle: {
        position: 'sticky',
        top: 0,
      },
    }));

  return (
    <EntityPageHorizontalTable
      data={data}
      headings={stubHeadings}
      style={{
        maxHeight: 350,
        minHeight: 0,
        overflowY: 'auto',
        width: '100%',
      }}
      />
  );
};

export default ClusterTable;
