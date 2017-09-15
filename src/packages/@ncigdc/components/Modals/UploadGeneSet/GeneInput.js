import React from 'react';
import { debounce } from 'lodash';

import TextArea from './TextArea';
import FileUpload from './FileUpload';

const onUpdate = debounce((str, callback) => {
  callback(
    str
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(g => g.toUpperCase()),
  );
}, 500);

const initState = { inputGenes: '', inputFiles: '' };

class GeneInput extends React.Component {
  state = initState;
  update = str => {
    this.setState({ inputGenes: str });
    onUpdate(str, this.props.onUpdate);
  };
  clear() {
    this.setState(initState);
    this.props.onUpdate([]);
  }
  render() {
    return (
      <div>
        <TextArea
          inputGenes={this.state.inputGenes}
          setInputGenes={this.update}
        />
        <FileUpload
          inputFiles={this.state.inputFiles}
          setInputGenes={this.update}
          setInputFile={files => this.setState({ inputFiles: files })}
        />
      </div>
    );
  }
}

export default GeneInput;
