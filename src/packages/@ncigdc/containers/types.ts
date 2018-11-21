export interface ITableProps {
  ssmCounts: {};
  downloadable?: boolean;
  totalCases: number;
  totalFiles: number;
  endpoint?: string;
  hits: {
    edges: Array<{
      node: {
        id: string;
      };
    }>;
    total: number;
  };
  relay: {
    route: {
      params: {};
    };
  };
  canAddToCart?: boolean;
  tableHeader?: string;
  projects: {
    total: number;
    edges: Array<{
      node: {
        project_id: string;
        summary: {
          file_count: number;
          data_categories: Array<{}>;
        };
      };
    }>;
  };
  query: {};
}
