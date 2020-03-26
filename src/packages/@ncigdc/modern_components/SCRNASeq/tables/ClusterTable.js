import React from 'react';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { random } from 'lodash';

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

  const makeStubDataRow = () => stubHeadings.reduce((acc, curr, i) => ({
    ...acc,
    [curr.key]: curr.key === 'seurat_cluster'
      ? random(1, 11)
      : random(1000, 9999),
  }), {});

  const stubData = [...Array(20)]
    .map(() => ({
      ...makeStubDataRow(),
      cell_barcode: `ENSG00000${random(100000, 999999)}`,
    }));

  console.log(stubData);

  return (
    <EntityPageHorizontalTable
      data={stubData}
      headings={stubHeadings}
      style={{
        maxHeight: 320,
        maxWidth: 460,
        minHeight: 0,
        overflowX: 'visible',
        overflowY: 'auto',
        width: '100%',
      }}
      />
  );
};

export default ClusterTable;
