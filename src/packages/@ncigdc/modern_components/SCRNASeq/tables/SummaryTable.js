import React from 'react';

import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { SummaryCellsPlot } from '../plots';

const SummaryTable = ({ containerStyle, header, rows }) => (
  <div key={header} style={containerStyle}>
    <h3
      style={{
        margin: '0 0 10px 0',
        textAlign: 'left',
      }}
      >
      {header}
    </h3>
    {header === 'Cells' && <SummaryCellsPlot />}
    <EntityPageHorizontalTable
      data={rows.map(([key, value]) => ({
        key,
        value,
      }))}
      headings={[{ key: 'key' }, { key: 'value' }]}
      showHeadings={false}
      tableContainerStyle={{ width: '100%' }}
      />
  </div>
);

export default SummaryTable;
