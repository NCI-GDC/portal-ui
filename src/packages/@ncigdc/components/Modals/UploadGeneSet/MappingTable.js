import React from 'react';
import { get } from 'lodash';

import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { geneMap, GENE_ID_FIELDS } from '@ncigdc/utils/validateIds';
import LocalPaginationTable from '@ncigdc/components/LocalPaginationTable';
import Button from '@ncigdc/uikit/Button';
import Row from '@ncigdc/uikit/Flex/Row';
import saveFile from '@ncigdc/utils/filesaver';
import toTsvString from '@ncigdc/utils/toTsvString';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { theme } from '@ncigdc/theme/index';
import TabbedLinks from '@ncigdc/components/TabbedLinks';

const ID_FIELD_DISPLAY = {
  symbol: 'Symbol',
  gene_id: 'Ensembl',
  'external_db_ids.entrez_gene': 'Entrez',
  'external_db_ids.hgnc': 'HGNC',
  'external_db_ids.uniprotkb_swissprot': 'UniProtKB/Swiss-Prot',
  'external_db_ids.omim_gene': 'OMIM',
};

export default ({ genes, invalidGenes, ...props }) => {
  const submittedHeaders = [];
  const unmatched = invalidGenes.map(gene => ({ submitted: gene }));
  const matched = Object.entries(
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
  const to = matched.length;

  return (
    <TabbedLinks
      {...props}
      queryParam="uploadGeneTab"
      links={[
        {
          id: 'matched',
          text: `Matched (${from})`,
          component: (
            <div>
              <div style={{ margin: '1rem 1rem 0' }}>
                {from} submitted gene identifier{from > 1 ? 's' : ''}{' '}
                mapped to{' '}
                {to} GDC gene{to > 1 ? 's' : ''}
              </div>
              <LocalPaginationTable
                prefix="matchedGenes"
                data={matched}
                entityName="submitted gene identifiers"
                sizes={[5, 10, 20, 40, 60, 80, 100]}
                buttons={
                  <Row style={{ alignItems: 'flex-end' }}>
                    <Button
                      style={{ ...visualizingButton }}
                      onClick={() =>
                        saveFile(
                          toTsvString(
                            matched.map(item => ({
                              submitted: item.submitted,
                              mappedGeneId: item.mapped[0],
                              mappedSymbol: item.mapped[1],
                            })),
                          ),
                          'TSV',
                          `matched-gene-list.tsv`,
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
          ),
        },
        {
          id: 'unmatched',
          text: `Unmatched (${invalidGenes.length})`,
          component: (
            <div>
              <div style={{ margin: '1rem 1rem 0' }}>
                {invalidGenes.length} submitted gene identifier{invalidGenes.length > 1 ? 's' : ''}{' '}
                not recognized
              </div>
              <LocalPaginationTable
                prefix="unmatchedGenes"
                data={unmatched}
                entityName="submitted gene identifiers"
                buttons={
                  <Row style={{ alignItems: 'flex-end' }}>
                    <Button
                      style={{ ...visualizingButton }}
                      onClick={() =>
                        saveFile(
                          toTsvString(unmatched),
                          'TSV',
                          `unmatched-gene-list.tsv`,
                        )}
                    >
                      TSV
                    </Button>
                  </Row>
                }
              >
                <EntityPageHorizontalTable
                  headings={[
                    {
                      key: 'submitted',
                      title: 'Submitted Gene Identifier',
                      thStyle: { textAlign: 'center' },
                    },
                  ]}
                />
              </LocalPaginationTable>
            </div>
          ),
        },
      ]}
    />
  );
};
