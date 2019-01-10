import { fetchApi } from '@ncigdc/utils/ajax';
import consoleDebug from '@ncigdc/utils/consoleDebug';

interface IFileHistory {
  data_release: string;
  file_change: string;
  release_date: string;
  uuid: string;
  version: string;
}

type TFileSearchResult = any;

type IFile = TFileSearchResult | IFileHistory;

type TFetchFileHistory = (
  query: string
) => Promise<[IFileHistory]> | Promise<[IFileHistory]>;

type TExtractFilePath = (file: IFile) => string;

const fetchFileHistory: TFetchFileHistory = query => {
  return fetchApi(`/history/${encodeURIComponent(query)}`, {
    method: 'GET',
  })
    .then(response => {
      if (!response) {
        consoleDebug('throwing response error');
        throw new Error('error');
      }
      return response;
    })
    .catch(err => {
      return [];
    });
};

export const extractFilePath: TExtractFilePath = file => {
  if (file.id) {
    return `/${atob(file.id)
      .split(':')[0]
      .toLocaleLowerCase()}s/${atob(file.id).split(':')[1]}`;
  } else {
    return `/files/${file.uuid}`;
  }
};

export default fetchFileHistory;
