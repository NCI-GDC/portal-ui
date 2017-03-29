// @flow
import filesize from 'filesize';

export default (input, options) => filesize(input, { base: 10, ...options }).toUpperCase();
