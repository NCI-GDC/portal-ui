// @flow
import React from 'react';

let baseStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  opacity: 0,
  width: '100%',
  zIndex: 1,
  cursor: 'pointer',
};

type TProps = {|
  addFiles: Function,
  style?: {},
|};

export default ({ addFiles, style, ...props }: TProps) => {
  return (
    <input
      {...props}
      style={{ ...baseStyle, ...style }}
      type="file"
      title="File Input"
      data-test={props['data-test'] || 'file-input'}
      onChange={event => {
        addFiles(Array.prototype.slice.call(event.target.files));

        /*
         *  In IE, changing the input refires `onchange` with an empty file
         *  Without resetting the input, you cannot submit the same file twice.
         */
        if (!('ActiveXObject' in window)) {
          event.target.value = '';
        }
      }}
    />
  );
};
