import React from 'react';
import { get, isEqual } from 'lodash';

import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { geneMap, GENE_ID_FIELDS } from '@ncigdc/utils/validateIds';
import Button from '@ncigdc/uikit/Button';
import Row from '@ncigdc/uikit/Flex/Row';
import saveFile from '@ncigdc/utils/filesaver';
import toTsvString from '@ncigdc/utils/toTsvString';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { theme } from '@ncigdc/theme/index';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import { withPropsOnChange, compose, lifecycle } from 'recompose';

const ID_FIELD_DISPLAY = {
  symbol: 'Symbol',
  gene_id: 'Ensembl',
  'external_db_ids.entrez_gene': 'Entrez',
  'external_db_ids.hgnc': 'HGNC',
  'external_db_ids.uniprotkb_swissprot': 'UniProtKB/Swiss-Prot',
  'external_db_ids.omim_gene': 'OMIM',
};

const enhance = compose(
  lifecycle({
    shouldComponentUpdate(nextProps) {
      return ['invalidGenes', 'genes'].some(
        key => !isEqual(nextProps[key], this.props[key]),
      );
    },
  }),
  withPropsOnChange(['invalidGenes'], ({ genes, invalidGenes }) => {
    return {
      unmatched: invalidGenes.map(gene => ({ submitted: gene })),
    };
  }),
  withPropsOnChange(['genes'], ({ genes }) => {
    const submittedHeaders = [];

    return {
      submittedHeaders,
      matched: Object.entries(
        genes.reduce((acc, gene) => {
          acc[geneMap[gene].gene_id] = (acc[geneMap[gene].gene_id] || [])
            .concat(gene);
          return acc;
        }, {}),
      )
        .map(([geneId, submitted]) => {
          const geneData = geneMap[geneId];
          var temp = GENE_ID_FIELDS.map((idField, i) => {
            const value = []
              .concat(get(geneData, idField, []))
              .filter(v => submitted.includes(v.toUpperCase()))[0];

            if (value) {
              submittedHeaders[i] = idField;
              return value;
            } else {
              return '';
            }
          });

          return {
            submitted: temp,
            mapped: [geneId, geneMap[geneId].symbol],
          };
        })
        .map(row => ({
          ...row,
          submitted: row.submitted.filter((s, i) => submittedHeaders[i]),
        })),
    };
  }),
);

export default enhance(
  ({ genes, matched, unmatched, submittedHeaders, ...props }) => {
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
                <Row
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '1rem',
                  }}
                >
                  <div>
                    {from} submitted gene identifier{from > 1 ? 's' : ''}{' '}
                    mapped to{' '}
                    {to} GDC gene{to > 1 ? 's' : ''}
                  </div>
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
                <EntityPageHorizontalTable
                  dividerStyle={{
                    borderLeft: `1px solid ${theme.greyScale3}`,
                  }}
                  data={matched}
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
              </div>
            ),
          },
          {
            id: 'unmatched',
            text: `Unmatched (${unmatched.length})`,
            component: (
              <div>
                <Row
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '1rem',
                  }}
                >
                  <div>
                    {unmatched.length} submitted gene identifier{unmatched.length > 1 ? 's' : ''}{' '}
                    not recognized
                  </div>
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
                <EntityPageHorizontalTable
                  data={unmatched}
                  headings={[
                    {
                      key: 'submitted',
                      title: 'Submitted Gene Identifier',
                      thStyle: { textAlign: 'center' },
                    },
                  ]}
                />
              </div>
            ),
          },
        ]}
      />
    );
  },
);
