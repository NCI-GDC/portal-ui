import React from 'react';

import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';

const SummaryTable = ({ containerStyle, header, rows }) => (
  <div key={header} style={containerStyle}>
    <h2
      style={{
        margin: '0 0 10px 0',
        width: '100%',
      }}
      >
      {header}
    </h2>
    <EntityPageHorizontalTable
      data={rows.map(([key, value]) => ({
        key,
        value,
      }))}
      headings={[{
        key: 'key',
      },
      {
        key: 'value',
        tdStyle: {
          textAlign: 'right',
        },
      }]}
      showHeadings={false}
      tableContainerStyle={{ width: '100%' }}
      />
  </div>
);

export default SummaryTable;
