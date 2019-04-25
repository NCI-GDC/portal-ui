// @flow
import React from 'react';

type TProps = { addFiles: Function };

export default ({ addFiles, ...props }: TProps) => {
  return (
    <input
      {...props}
      type="file"
      title="File Input"
      className={props.className + ' test-file-input'}
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
