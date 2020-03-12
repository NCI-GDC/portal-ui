import React from 'react';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';

const ClusterTable = () => {
  // make stub data
  const clusterArray = [...Array(11)].map((arr, i) => ({
    key: `cluster-${i + 1}`,
    subheadings: ['L2FC', 'p-value'],
    title: `Cluster ${i + 1}`,
  }));
  const headings = [
    {
      key: 'feature',
      subheadings: ['ID', 'Name'],
      title: 'Feature',
    },
  ].concat(clusterArray)
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

  return (
    <div
      style={{
        maxWidth: 800,
        overflowX: 'auto',
      }}
      >
      <EntityPageHorizontalTable
        data={[
          [
            1,
            2,
            3,
            4,
          ],
          [
            5,
            6,
            7,
            8,
            9,
          ],
          [
            1,
            2,
            3,
            4,
          ],
          [
            5,
            6,
            7,
            8,
            9,
          ],
          [
            1,
            2,
            3,
            4,
          ],
          [
            5,
            6,
            7,
            8,
            9,
          ],
          [
            1,
            2,
            3,
            4,
          ],
          [
            5,
            6,
            7,
            8,
            9,
          ],
          [
            1,
            2,
            3,
            4,
          ],
          [
            5,
            6,
            7,
            8,
            9,
          ],
          [
            1,
            2,
            3,
            4,
          ],
          [
            5,
            6,
            7,
            8,
            9,
          ],
          [
            1,
            2,
            3,
            4,
          ],
          [
            5,
            6,
            7,
            8,
            9,
          ],
        ]}
        headings={headings}
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
