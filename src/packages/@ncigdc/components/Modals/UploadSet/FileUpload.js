import React from 'react';
import { compose, withState } from 'recompose';

import FileInput from '@ncigdc/components/FileInput';
import { Row } from '@ncigdc/uikit/Flex';
import { buttonBaseStyles } from '@ncigdc/uikit/Button';
import { SpinnerIcon } from '@ncigdc/theme/icons';
import styled from '@ncigdc/theme/styled';

const BrowseButton = styled.label({
  ...buttonBaseStyles,
  marginRight: 5,
});

const REMOVE_HEADER_FROM_TSV = false;
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = evt => resolve({
      result: reader.result,
      file,
    });
  });
}

const enhance = compose(withState('uploading', 'setUploading', false));

export default enhance(
  ({
    setInputFile, setInput, inputFiles, setUploading, uploading,
  }) => {
    return (
      <div>
        Or choose a file to upload
        <Row style={{ alignItems: 'center' }}>
          <BrowseButton>
            Browse
            <FileInput
              accept=".tsv,.csv,.txt"
              addFiles={files => {
                setUploading(true);
                setInputFile(files.map(f => f.name).join(', '));

                Promise.all(files.map(f => readFile(f))).then(data => {
                  setInput(
                    data
                      .map(
                        ({ result, file }) => (REMOVE_HEADER_FROM_TSV && file.name.match(/\.tsv$/)
                            ? result.replace(/.*\n/, '')
                            : result),
                      )
                      .join(),
                  );
                  setUploading(false);
                });
              }}
              multiple
              style={{ display: 'none' }} />
          </BrowseButton>
          {inputFiles}
        </Row>
        {uploading && (
          <span>
            <SpinnerIcon />
            {' '}
uploading files
          </span>
        )}
      </div>
    );
  },
);
