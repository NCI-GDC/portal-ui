import React from 'react';
import Column from '../uikit/Flex/Column';
import Row from '../uikit/Flex/Row';
import Button from '../uikit/Button';
import withDropdown from '../uikit/withDropdown';
import downloadSvg from '../utils/download-svg';
import saveFile from '../utils/filesaver';
import moment from 'moment'

export const zDepth1 = {
  boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
};

export const dropdown = {
  ...zDepth1,
  position: 'absolute',
  zIndex: 1,
  minWidth: '165px',
  backgroundColor: 'white',
  textAlign: 'left',
  marginTop: '1rem',
  right: 0,
  outline: 'none',
  maxHeight: '200px',
  overflow: 'auto',
};

const styles = {
  heading: {
    flexGrow: 1,
    fontSize: '2.2rem',
    marginBottom: 7,
    marginTop: 7,
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    color: '#333',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    marginRight: 12,
    minWidth: 46,
    minHeight: 34,
    display: 'inline-flex',
    outline: 'none',
  },
};

let ProteinLolliplot = ({
  active,
  setActive,
  mouseDownHandler,
  mouseUpHandler,
  gene,
  $scope,
  reset,
}) => (
  <Column>
    <Row>
      <h1 style={{...styles.heading, padding: `1rem`}} id="protein">
        <img src="images/double-helix.svg" alt="GDC cBio Portal" style={{ marginRight: '1rem', width: `12px` }} />
        Protein
      </h1>
    </Row>
    <Row style={{ marginBottom: '2rem', padding: `0 2rem` }} spacing="1rem">
      <span style={{ alignSelf: 'center' }}>
        Transcript:
      </span>
      <Button
        style={{
          ...styles.button,
          fontWeight: $scope.geneTranscript.id === gene.canonical_transcript_id
            ? 'bold' : 'initial'
        }}
        onClick={() => setActive(true)}
        rightIcon={<i className="fa fa-caret-down" />}
      >
        {$scope.geneTranscript.id} ({$scope.geneTranscript.length_amino_acid} aa)
        {active &&
          <Column
            style={{ ...dropdown, width: '22rem' }}
            onMouseDown={mouseDownHandler}
            onMouseUp={mouseUpHandler}
          >
            {$scope.transcripts
            .filter(t => t.id === gene.canonical_transcript_id)
            .map(t =>
              <div
                key={t.id}
                className="dropdown-item"
                style={{
                  padding: '0.3rem 0.6rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  ...($scope.geneTranscript.id === t.id
                    ? {
                      backgroundColor: 'rgb(44, 136, 170)',
                      color: `white`,
                    }
                    : {})
                }}
                onClick={
                  () => {
                    $scope.selectTranscript(t.id);
                    setTimeout(() => setActive(false))
                  }
                }
              >
                {t.id} ({t.length_amino_acid} aa)
              </div>
            )}
            {$scope.transcripts
            .filter(t => t.length_amino_acid && t.id !== gene.canonical_transcript_id)
            .map(t =>
              <div
                key={t.id}
                className="dropdown-item"
                style={{
                  padding: '0.3rem 0.6rem',
                  cursor: 'pointer',
                  fontWeight: 'normal',
                  ...($scope.geneTranscript.id === t.id
                    ? {
                      backgroundColor: 'rgb(44, 136, 170)',
                      color: `white`,
                    }
                    : {})
                }}
                onClick={
                  () => {
                    $scope.selectTranscript(t.id);
                    setTimeout(() => setActive(false))
                  }
                }
              >
                {t.id} ({t.length_amino_acid} aa)
              </div>
            )}
          </Column>
        }
      </Button>
      <Button
        style={styles.button}
        onClick={reset}
        leftIcon={<i className="fa fa-refresh" />}
      >
        Reset
      </Button>
      <Button
        style={styles.button}
        onClick={
          () => {
            saveFile(
              JSON.stringify($scope.proteinLolliplotData, null, 2),
              'JSON',
              `protein_viewer-${gene.symbol}-${moment().format('YYYY-MM-DD')}`
            )
          }
        }
        leftIcon={<i className="fa fa-download" />}
      >
        JSON
      </Button>
      <Button
        style={styles.button}
        leftIcon={<i className="fa fa-download" />}
        onClick={
          () => {
            downloadSvg({
              svg: document.querySelector(`#protein-viewer-root svg.chart`),
              stylePrefix: `#protein-viewer-root`,
              fileName: 'protein-viewer.svg',
            });
          }
        }
      >
        SVG
      </Button>
    </Row>
    <div style={{padding: `0 3rem` }} id="protein-viewer-root" />
  </Column>
);

export default withDropdown(ProteinLolliplot);
