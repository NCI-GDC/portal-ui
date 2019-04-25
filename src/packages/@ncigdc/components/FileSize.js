/* @flow */
/* eslint flowtype/no-weak-types:0 */

import React from 'react';
import formatFileSize from '@ncigdc/utils/formatFileSize';

type TProps = {
  bytes: number,
  options?: {
    base?: number,
    bits?: boolean,
    exponent?: number,
    output?: string,
    round?: number,
    spacer?: string,
    standard?: string,
    symbols?: Object,
    unix?: boolean,
  },
};

const FileSize = (props: TProps) => (
  <span className={props.className + ' test-file-size'}>
    {formatFileSize(props.bytes, {
      ...props.options,
    })}
  </span>
);

export default FileSize;
