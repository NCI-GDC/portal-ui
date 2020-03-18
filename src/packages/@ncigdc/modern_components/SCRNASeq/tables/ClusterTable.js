import React from 'react';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { random } from 'lodash';

const ClusterTable = () => {
  const stubClusterArray = [...Array(11)].map((arr, i) => ({
    key: `cluster-${i + 1}`,
    subheadings: ['L2FC', 'p-value'],
    title: `Cluster ${i + 1}`,
  }));

  const stubHeadings = [
    {
      key: 'feature',
      subheadings: ['ID', 'Name'],
      title: 'Feature',
    },
  ].concat(stubClusterArray)
    .map(row => ({
      ...row,
      thStyle: {
        position: 'sticky',
        top: 0,
      },
      thSubheadingStyle: {
        position: 'sticky',
        top: 26,
      },
    }));

  const makeStubDataRow = () => [...Array(11)].reduce((acc, curr, i) => ({
    ...acc,
    [`cluster-${i + 1}`]: [(random(1, 9, 2)).toFixed(2), `${random(1, 9)}e-${random(10, 99)}`],
  }), {});

  const stubData = [...Array(20)]
    .map(() => ({
      feature: [`ENSG00000${random(100000, 999999)}`, random(1000, 9999)],
      ...makeStubDataRow(),
    }));

  return (
    <div
      style={{
        maxWidth: 800,
        overflowX: 'auto',
      }}
      >
      <EntityPageHorizontalTable
        data={stubData}
        headings={stubHeadings}
        style={{
          maxHeight: 300,
          overflowX: 'visible',
          overflowY: 'auto',
          width: '100%',
        }}
        />
    </div>
  );
};

export default ClusterTable;
