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

const initState = { input: '', inputFiles: '' };

class SetInput extends React.Component {
  state = initState;
  update = str => {
    this.setState({ input: str });
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
          input={this.state.input}
          setInput={this.update}
          helpText={this.props.helpText}
          placeholder={this.props.placeholder}
          displayType={this.props.displayType}
        />
        <FileUpload
          inputFiles={this.state.inputFiles}
          setInput={this.update}
          setInputFile={files => this.setState({ inputFiles: files })}
        />
      </div>
    );
  }
}

export default SetInput;
