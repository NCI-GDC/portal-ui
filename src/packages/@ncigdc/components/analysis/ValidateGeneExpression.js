import React from 'react';
import { Row, Column } from '@ncigdc/uikit/Flex';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';

const headings = isClinical => [
  {
    key: 'select',
    title: 'Select',
  },
  {
    key: 'name',
    title: isClinical ? 'Case Set Name' : 'Name',
  },
  {
    key: 'count',
    style: { textAlign: 'right' },
    title: isClinical ? '#Cases' : 'Items',
  },
].splice(1, 0, isClinical
  ? {
    key: 'type',
    title: 'Type',
  }
  : {})
  .filter(heading => Object.keys(heading).length);

const ValidateGeneExpression = ({
  // selectedSets,
  styles,
}) => (
  <Row style={styles.rowStyle}>
    <Column style={{ flex: 1 }}>
      <h2
        style={{
          color: '#c7254e',
          fontSize: '1.8rem',
        }}
        >
        Step 3: Check available data
      </h2>

      <div style={{ marginBottom: 15 }}>
        Check if your input sets have gene expression data available before running the analysis.
      </div>

      {/* setsData && setsData.length > 0 && (
        <EntityPageHorizontalTable
          data={setsData}
          headings={headings(isClinical)}
          />
      ) */}
    </Column>
  </Row>
);

export default ValidateGeneExpression;
