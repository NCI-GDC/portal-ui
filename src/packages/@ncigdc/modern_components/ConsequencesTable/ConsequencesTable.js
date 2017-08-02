// @flow
import React from 'react';
import { compose, withPropsOnChange } from 'recompose';
import { orderBy, groupBy, get, find } from 'lodash';
import externalReferenceLinks from '@ncigdc/utils/externalReferenceLinks';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import LocalPaginationTable from '@ncigdc/components/LocalPaginationTable';
import DownloadTableToTsvButton from '@ncigdc/components/DownloadTableToTsvButton';
import { Row } from '@ncigdc/uikit/Flex';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import saveFile from '@ncigdc/utils/filesaver';
import { tableToolTipHint, visualizingButton } from '@ncigdc/theme/mixins';
import GeneLink from '@ncigdc/components/Links/GeneLink';
import BubbleIcon from '@ncigdc/theme/icons/BubbleIcon';
import MinusIcon from '@ncigdc/theme/icons/Minus';
import PlusIcon from '@ncigdc/theme/icons/Plus';
import { ExternalLink } from '@ncigdc/uikit/Links';
import Button from '@ncigdc/uikit/Button';
import { withTheme } from '@ncigdc/theme';

const paginationPrefix = 'consequencesTable';

const strandIconMap = {
  '-1': <MinusIcon />,
  // $FlowIgnore
  1: <PlusIcon />,
};

type TProps = {
  consequenceDataGrouped: Object,
  theme: Object,
  functionalImpactTranscript: Object,
  canonicalTranscriptId: string,
  dataRows: Array<Object>,
  consequences: Array<Object>,
};

export default compose(
  withTheme,
  withPropsOnChange(
    ['viewer'],
    ({ viewer: { explore: { ssms: { hits: { edges } } } }, theme }) => {
      const node = edges[0].node;
      const consequenceOfInterest = node.consequence.hits.edges.find(
        consequence => get(consequence, 'node.transcript.annotation.impact'),
        {},
      );
      const functionalImpactTranscript = get(
        consequenceOfInterest,
        'node.transcript',
        {},
      );

      const canonicalTranscriptId = (find(
        node.consequence.hits.edges,
        'node.transcript.is_canonical',
      ) || { node: { transcript: { transcript_id: '' } } }).node.transcript
        .transcript_id;

      const consequenceDataGrouped = groupBy(node.consequence.hits.edges, c => {
        const { transcript: t } = c.node;
        return `${t.gene.symbol}${t.aa_change}${t.consequence_type}${t
          .annotation.hgvsc}${t.gene.gene_strand}`;
      });

      const consequences = node.consequence.hits.edges.map(
        x => x.node.transcript,
      );

      const dataRows = orderBy(
        consequences.map(transcript => {
          return {
            symbol: (
              <GeneLink uuid={transcript.gene.gene_id}>
                {transcript.gene.symbol}
              </GeneLink>
            ),
            aa_change: transcript.aa_change,
            consequence: transcript.consequence_type,
            coding_dna_change: transcript.annotation.hgvsc,
            strand: transcript.gene.gene_strand
              ? strandIconMap[transcript.gene.gene_strand.toString(10)]
              : '--',
            transcripts: (
              <span>
                <ExternalLink
                  key={transcript.transcript_id}
                  style={{
                    paddingRight: '0.5em',
                    fontWeight: transcript.transcript_id ===
                      functionalImpactTranscript.transcript_id
                      ? 'bold'
                      : 'normal',
                  }}
                  href={externalReferenceLinks.ensembl(
                    transcript.transcript_id,
                  )}
                >
                  {transcript.transcript_id}
                </ExternalLink>
                {transcript.transcript_id === canonicalTranscriptId &&
                  <BubbleIcon
                    text="C"
                    toolTipText="Canonical"
                    backgroundColor={theme.primary}
                  />}
              </span>
            ),
          };
        }),
        ['aa_change'],
        ['asc'],
      );

      return {
        functionalImpactTranscript,
        canonicalTranscriptId,
        consequenceDataGrouped,
        consequences,
        dataRows,
      };
    },
  ),
)(
  (
    {
      dataRows,
      consequences,
      consequenceDataGrouped,
      canonicalTranscriptId,
      functionalImpactTranscript,
      theme,
      context,
    }: TProps = {},
  ) =>
    <LocalPaginationTable
      entityName={context}
      style={{ width: '100%', minWidth: 450 }}
      data={dataRows}
      prefix={paginationPrefix}
      buttons={
        <Row style={{ alignItems: 'flex-end' }}>
          <Tooltip
            Component={<span>Export All</span>}
            style={{ marginLeft: '2rem' }}
          >
            <Button
              style={{ ...visualizingButton }}
              onClick={() =>
                saveFile(
                  JSON.stringify(consequences, null, 2),
                  'JSON',
                  'consequences-data.json',
                )}
            >
              JSON
            </Button>
          </Tooltip>
          <DownloadTableToTsvButton
            selector="#consequences-table"
            filename="consequences-table.tsv"
            style={{ marginLeft: '0.5rem' }}
          />
        </Row>
      }
    >
      <EntityPageHorizontalTable
        tableId="consequences-table"
        style={{ width: '100%', minWidth: '450px' }}
        headings={[
          { key: 'symbol', title: 'Gene' },
          {
            key: 'aa_change',
            title: 'AA Change',
            tdStyle: { wordBreak: 'break-all', whiteSpace: 'pre-line' },
          },
          {
            key: 'consequence',
            title: (
              <Tooltip
                Component={'SO Term: consequence type'}
                style={tableToolTipHint()}
              >
                Consequence
              </Tooltip>
            ),
          },
          {
            key: 'coding_dna_change',
            title: 'Coding DNA Change',
            tdStyle: { wordBreak: 'break-all', whiteSpace: 'pre-line' },
          },
          { key: 'strand', title: 'Strand' },
          { key: 'transcripts', title: 'Transcript(s)' },
        ]}
      />
    </LocalPaginationTable>,
);
