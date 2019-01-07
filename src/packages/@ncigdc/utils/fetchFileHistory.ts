import { fetchApi } from '@ncigdc/utils/ajax';

interface IFileHistory {
  data_release: string;
  file_change: string;
  release_date: string;
  uuid: string;
  version: string;
}

type TFetchFileHistory = (
  query: string
) => Promise<[IFileHistory]> | Promise<[]>;

const fetchFileHistory: TFetchFileHistory = query => {
  return fetchApi(`/history/${encodeURIComponent(query)}`, {
    method: 'GET',
  })
    .then(response => {
      if (!response) {
        console.log('throwing response error');
        throw new Error('error');
      }
      return response;
    })
    .catch(err => {
      return [];
    });
};

export default fetchFileHistory;
