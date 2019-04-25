import { fetchApi } from '@ncigdc/utils/ajax';
import consoleDebug from '@ncigdc/utils/consoleDebug';

interface IFileHistory {
  data_release: string;
  file_change: string;
  release_date: string;
  uuid: string;
  version: string;
}

interface IFileSearchResult {
  id: string;
  cytoband: [
    string
  ];
  external_db_ids: {
    entrez_gene: [string];
    hgnc: [
      string
    ];
    omim_gene: [string];
    uniprotkb_swissprot: [string]
  };
  gene_id: string;
  name: string;
  symbol: string;
  synonyms: [
    string
  ];
  transcripts: {
    hits: {
      edges: [
        {
          node: {
            transcript_id: string;
            translation_id: string
          }
        }
      ]
    }
  }
}

type IFile = IFileSearchResult | IFileHistory;

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
  if ((file as IFileSearchResult).id) {
    return `/${atob((file as IFileSearchResult).id)
      .split(':')[0]
      .toLocaleLowerCase()}s/${atob((file as IFileSearchResult).id).split(':')[1]}`;
  }
  return `/files/${(file as IFileHistory).uuid}`;
};

export default fetchFileHistory;
