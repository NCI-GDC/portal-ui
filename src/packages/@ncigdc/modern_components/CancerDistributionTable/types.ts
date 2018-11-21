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

export interface IBucket {
  doc_count: number;
  key: string;
}

export interface IAggregations {
  occurrence__case__project__project_id: {
    buckets: IBucket[];
  };
}

interface ICommonProps {
  geneId: number;
  entityName: string;
  filters: IGroupFilter;
  tableType: string;
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
        aggregations: IAggregations;
      };
    };
  };
}

export type TCancerDistributionTableProps = {
  projectsViewer: {};
} & ICommonProps;

export type TCancerDistributionTableModelProps = {} & ICommonProps;
