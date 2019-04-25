import React from 'react';
import moment from 'moment';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Dropdown from '@ncigdc/uikit/Dropdown';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import { Row } from '@ncigdc/uikit/Flex';

export default ({
  activeTranscript,
  gene,
  transcripts,
  setState,
  lolliplotData,
  selector,
}) => (
  <Row
    spacing="1rem"
    style={{
      marginBottom: '2rem',
      padding: '0 2rem',
      alignItems: 'center',
      height: '35px',
    }}>
    <span style={{ alignSelf: 'center' }}>Transcript:</span>
    <Dropdown
      selected={(
        <span
          style={{
            fontWeight:
              activeTranscript.transcript_id === gene.canonical_transcript_id
                ? 'bold'
                : 'initial',
          }}>
          {activeTranscript.transcript_id}
          {' '}
(
          {activeTranscript.length_amino_acid}
          {' '}
aa)
        </span>
      )}>
      {transcripts
        .filter(t => t.transcript_id === gene.canonical_transcript_id)
        .map(t => (
          <DropdownItem
            key={t.transcript_id}
            onClick={() => setState(s => ({
              ...s,
              activeTranscript: t,
              min: 0,
              max: t.length_amino_acid,
            }))}
            style={{
              fontWeight: 'bold',
              ...(activeTranscript.transcript_id === t.transcript_id
                ? {
                  backgroundColor: 'rgb(44, 136, 170)',
                  color: 'white',
                }
                : {}),
              cursor: 'pointer',
            }}>
            {t.transcript_id}
            {' '}
(
            {t.length_amino_acid}
            {' '}
aa)
          </DropdownItem>
        ))}
      {transcripts
        .filter(
          t => t.length_amino_acid &&
            t.transcript_id !== gene.canonical_transcript_id,
        )
        .map(t => (
          <DropdownItem
            key={t.transcript_id}
            onClick={() => setState(s => ({
              ...s,
              activeTranscript: t,
              min: 0,
              max: t.length_amino_acid,
            }))}
            style={{
              ...(activeTranscript.transcript_id === t.transcript_id
                ? {
                  backgroundColor: 'rgb(44, 136, 170)',
                  color: 'white',
                }
                : {}),
              cursor: 'pointer',
            }}>
            {t.transcript_id}
            {' '}
(
            {t.length_amino_acid}
            {' '}
aa)
          </DropdownItem>
        ))}
    </Dropdown>
    <Button
      leftIcon={<i className="fa fa-refresh" />}
      onClick={() => setState(s => ({
        ...s,
        min: 0,
        max: activeTranscript.length_amino_acid,
      }))}
      style={visualizingButton}>
      Reset
    </Button>
    <DownloadVisualizationButton
      data={lolliplotData}
      slug={`protein_viewer-${gene.symbol}-${moment().format('YYYY-MM-DD')}`}
      stylePrefix="#protein-viewer-root"
      svg={() => wrapSvg({
        selector: `${selector} svg.chart`,
        title: `Gene: ${gene.symbol}, Transcript: ${activeTranscript.transcript_id}(${activeTranscript.length_amino_acid} aa)`,
        margins: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 40,
        },
        embed: {
          right: {
            width: 250,
            margins: {
              right: 20,
            },
            elements: [document.querySelector('#mutation-stats')],
          },
        },
      })} />
  </Row>
);
