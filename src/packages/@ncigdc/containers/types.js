/* @flow */

export type TTableProps = {
  ssmCounts: Object,
  downloadable?: boolean,
  totalCases: number,
  totalFiles: number,
  endpoint?: string,
  hits: {
    edges: Array<{
      node: {
        id: string,
      },
    }>,
    total: number,
  },
  relay: {
    route: {
      params: Object,
    },
  },
  canAddToCart?: boolean,
  tableHeader?: string,
  projects: {
    total: number,
    edges: Array<{
      node: {
        project_id: string,
        summary: {
          file_count: number,
          data_categories: Array<{}>,
        },
      },
    }>,
  },
  query: {},
};
