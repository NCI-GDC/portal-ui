// @flow
import filesize from 'filesize';

export type TFilesizeInput = (input?: number, options?: object) => void;

const FilesizeInput: TFilesizeInput = (input = 0, options) =>
  filesize(input || 0, { base: 10, ...options }).toUpperCase();

export default FilesizeInput;
