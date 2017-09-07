// @flow
import filesize from 'filesize';

export default (input, options) =>
  filesize(input || 0, { base: 10, ...options }).toUpperCase();
