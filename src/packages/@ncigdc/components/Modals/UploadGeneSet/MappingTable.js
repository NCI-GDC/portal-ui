import React from 'react';
import { uniq } from 'lodash';

import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { geneMap } from '@ncigdc/utils/validateIds';
import LocalPaginationTable from '@ncigdc/components/LocalPaginationTable';
import Button from '@ncigdc/uikit/Button';
import Row from '@ncigdc/uikit/Flex/Row';
import saveFile from '@ncigdc/utils/filesaver';
import toTsvString from '@ncigdc/utils/toTsvString';
import { visualizingButton } from '@ncigdc/theme/mixins';

const HEADINGS = [
  {
    key: 'submitted',
    title: 'Submitted Gene Identifier',
    thStyle: { textAlign: 'center' },
  },
  {
    key: 'mapped',
    title: 'Mapped',
    subheadings: ['GDC Gene ID', 'Symbol'],
    thStyle: { textAlign: 'center' },
  },
];

export default ({ genes, ...props }) => {
  const data = genes.map(gene => ({
    submitted: gene,
    mapped: [geneMap[gene].gene_id, geneMap[gene].symbol],
  }));
  const from = genes.length;
  const to = uniq(data.map(g => g.mapped[0])).length;
  return (
    <div {...props}>
      {from} submitted gene identifier{from > 1 ? 's' : ''} mapped to {to} GDC
      gene{to > 1 ? 's' : ''}
      <LocalPaginationTable
        prefix="uploadGeneSet"
        data={data}
        entityName="submitted gene identifiers"
        buttons={
          <Row style={{ alignItems: 'flex-end' }}>
            <Button
              style={{ ...visualizingButton }}
              onClick={() =>
                saveFile(
                  toTsvString(
                    data.map(item => ({
                      submitted: item.submitted,
                      mappedGeneId: item.mapped[0],
                      mappedSymbol: item.mapped[1],
                    })),
                  ),
                  'TSV',
                  `geneList.tsv`,
                )}
            >
              TSV
            </Button>
          </Row>
        }
      >
        <EntityPageHorizontalTable headings={HEADINGS} />
      </LocalPaginationTable>
    </div>
  );
};
