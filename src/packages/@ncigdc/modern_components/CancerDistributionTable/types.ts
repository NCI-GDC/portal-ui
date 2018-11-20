import { IGroupFilter } from '@ncigdc/utils/filters/types';

// TODO: No any types
export interface INode {
  project_id: string;
  disease_type?: any;
  site?: any;
  num_affected_cases?: any;
  num_affected_cases_total?: any;
  num_affected_cases_percent?: any;
  num_cnv_gain?: any;
  num_cnv_gain_percent?: any;
  num_cnv_loss?: any;
  num_cnv_loss_percent?: any;
  num_cnv_cases_total?: any;
}

export type TRawData = INode[];

interface IBucket {
  doc_count: number;
  key: string;
}

export interface ICancerDistributionTableProps {
  viewer: {
    explore: {
      cases: {
        filtered: {
          project__project_id: {
            buckets: IBucket[];
          };
        };
      };
      ssms: {
        aggregations: {
          occurrence__case__project__project_id: {
            buckets: IBucket[];
          };
        };
      };
    };
  };
  projectsViewer: {};
  geneId: number;
  entityName: string;
  filters: IGroupFilter;
  tableType: string;
}