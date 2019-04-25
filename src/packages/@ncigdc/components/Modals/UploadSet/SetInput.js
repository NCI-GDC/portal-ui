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

const initState = {
  input: '',
  inputFiles: '',
};

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
          displayType={this.props.displayType}
          helpText={this.props.helpText}
          input={this.state.input}
          placeholder={this.props.placeholder}
          setInput={this.update} />
        <FileUpload
          inputFiles={this.state.inputFiles}
          setInput={this.update}
          setInputFile={files => this.setState({ inputFiles: files })} />
      </div>
    );
  }
}

export default SetInput;
