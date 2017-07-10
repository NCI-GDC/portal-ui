import React from 'react';
import { uniq, get } from 'lodash';

import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { geneMap, GENE_ID_FIELDS } from '@ncigdc/utils/validateIds';
import LocalPaginationTable from '@ncigdc/components/LocalPaginationTable';
import Button from '@ncigdc/uikit/Button';
import Row from '@ncigdc/uikit/Flex/Row';
import saveFile from '@ncigdc/utils/filesaver';
import toTsvString from '@ncigdc/utils/toTsvString';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { theme } from '@ncigdc/theme/index';

const ID_FIELD_DISPLAY = {
  symbol: 'Symbol',
  gene_id: 'Ensembl',
  'external_db_ids.entrez_gene': 'Entrez',
  'external_db_ids.hgnc': 'HGNC',
  'external_db_ids.uniprotkb_swissprot': 'UniProtKB/Swiss-Prot',
  'external_db_ids.omim_gene': 'OMIM',
};

export default ({ genes, ...props }) => {
  const submittedHeaders = [];
  const data = Object.entries(
    genes.reduce((acc, gene) => {
      acc[geneMap[gene].gene_id] = (acc[geneMap[gene].gene_id] || [])
        .concat(gene);
      return acc;
    }, {}),
  )
    .map(([geneId, submitted]) => {
      const geneData = geneMap[geneId];

      return {
        submitted: GENE_ID_FIELDS.map((idField, i) => {
          const value = []
            .concat(get(geneData, idField, []))
            .filter(v => submitted.includes(v))[0];

          if (value) {
            submittedHeaders[i] = idField;
            return value;
          } else {
            return '';
          }
        }),
        mapped: [geneId, geneMap[geneId].symbol],
      };
    })
    .map(row => ({
      ...row,
      submitted: row.submitted.filter((s, i) => submittedHeaders[i]),
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
        <EntityPageHorizontalTable
          dividerStyle={{
            borderLeft: `1px solid ${theme.greyScale3}`,
          }}
          headings={[
            {
              key: 'submitted',
              title: 'Submitted Gene Identifier',
              subheadings: submittedHeaders
                .filter(Boolean)
                .map(h => ID_FIELD_DISPLAY[h]),
              thStyle: { textAlign: 'center' },
            },
            {
              key: 'mapped',
              title: 'Mapped',
              subheadings: ['GDC Gene ID', ID_FIELD_DISPLAY.symbol],
              thStyle: { textAlign: 'center' },
            },
          ]}
        />
      </LocalPaginationTable>
    </div>
  );
};
