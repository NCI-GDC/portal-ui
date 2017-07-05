// @flow
import React from 'react';
import { compose, withState, withPropsOnChange, withProps } from 'recompose';
import { debounce } from 'lodash';
import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { validateGenes, geneMap } from '@ncigdc/utils/validateIds';
import { SpinnerIcon } from '@ncigdc/theme/icons';

import MappingTable from './MappingTable';
import TextArea from './TextArea';
import CreateSetButton from './CreateSetButton';
import FileUpload from './FileUpload';
import Warning from './Warning';

const debounceValidateGenes = debounce(validateGenes, 200);

const styles = {
  horizontalPadding: {
    paddingRight: 20,
    paddingLeft: 20,
  },
};

const enhance = compose(
  withState('inputGenes', 'setInputGenes', ''),
  withState('validating', 'setValidating', false),
  withState('inputFiles', 'setInputFile', ''),
  withProps(props => ({
    onClear: () => {
      props.setInputFile('');
      props.setInputGenes('');
    },
  })),
  withPropsOnChange(
    ['inputGenes', 'validating'],
    ({ inputGenes, setValidating, validating }) => {
      const genes = inputGenes
        .split(/[\s,]+/)
        .filter(Boolean)
        .map(g => g.toUpperCase());
      if (!validating) {
        debounceValidateGenes(genes, setValidating);
      }

      return {
        genes: genes.filter(g => geneMap[g]),
        invalidGenes: genes.filter(g => geneMap[g] === null),
      };
    },
  ),
);

type TProps = {
  onClose: Function,
  inputGenes: string,
  setInputGenes: Function,
  invalidGenes: Array<string>,
  genes: Array<string>,
  validating: boolean,
  inputFiles: string,
  setInputFile: Function,
  onClear: Function,
};
const SelectOverlay = ({
  onClose,
  inputGenes,
  setInputGenes,
  invalidGenes,
  genes,
  validating,
  inputFiles,
  setInputFile,
  onClear,
}: TProps) => {
  return (
    <div
      style={{
        padding: '15px 0',
        maxHeight: 'calc(100vh - 60px)',
        overflow: 'auto',
      }}
    >
      <h2
        style={{
          ...styles.horizontalPadding,
          margin: 0,
          paddingBottom: 10,
        }}
      >
        Upload Gene Set
      </h2>
      <div
        style={{
          ...styles.horizontalPadding,
          borderTop: '1px solid #e5e5e5',
          borderBottom: '1px solid #e5e5e5',
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <TextArea
          inputGenes={inputGenes}
          setInputGenes={setInputGenes}
          onClear={onClear}
        />
        <FileUpload
          setInputGenes={setInputGenes}
          inputFiles={inputFiles}
          setInputFile={setInputFile}
        />
        {validating && <span><SpinnerIcon /> validating genes</span>}
        <Warning hasGenes={!!genes.length} invalidGenes={invalidGenes} />
        {genes.length > 0 &&
          <MappingTable genes={genes} style={{ marginTop: '2rem' }} />}
      </div>
      <Row
        style={{
          ...styles.horizontalPadding,
          justifyContent: 'flex-end',
          paddingTop: 10,
        }}
        spacing="1rem"
      >
        <Button onClick={() => onClose()}>Cancel</Button>
        <CreateSetButton genes={genes} onClose={onClose} />
      </Row>
    </div>
  );
};

export default enhance(SelectOverlay);
