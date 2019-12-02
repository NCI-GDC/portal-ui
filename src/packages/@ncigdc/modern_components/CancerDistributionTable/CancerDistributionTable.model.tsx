import React from 'react';
import { Row } from '@ncigdc/uikit/Flex';
import { makeFilter, replaceFilters } from '@ncigdc/utils/filters';
import ArrowIcon from '@ncigdc/theme/icons/ArrowIcon';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import MutationsCount from '@ncigdc/components/MutationsCount';
import ExploreSSMLink from '@ncigdc/components/Links/ExploreSSMLink';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import CollapsibleList from '@ncigdc/uikit/CollapsibleList';
import GreyBox from '@ncigdc/uikit/GreyBox';
import {
  INode,
  TCancerDistributionTableModelProps,
  IBucket,
  IAggregations,
} from './types';

type TNode = ({ node }: { node: INode }) => JSX.Element | number | string;

interface IModelEntry {
  name: string;
  id: string;
  sortable: boolean;
  downloadable: boolean;
  hidden?: boolean;
  th: (props: { sorted?: any, style?: React.CSSProperties }) => JSX.Element | string;
  td: TNode;
}

type TCancerDistributionTableModel = (
  props: TCancerDistributionTableModelProps
) => IModelEntry[];

const CancerDistributionTableModel: TCancerDistributionTableModel = ({
  tableType,
  viewer: { explore: { cases, ssms: { aggregations } } },
  entityName,
  filters,
  geneId = null,
}) => [
  {
    name: 'Project Id',
    id: 'project_id',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => 'Project Id',
    td: ({ node }) => node.project_id,
  },
  {
    name: 'SSM Affected Cases',
    id: 'num_affected_cases_percent',
    sortable: true,
    downloadable: true,
    hidden: true,
    th: () => 'Affected Cases',
    td: ({ node }) => node.num_affected_cases_percent,
  },
  {
    name: 'Project Id',
    id: 'project_id',
    sortable: false,
    downloadable: false,
    th: () => 'Project',
    td: ({ node }) => (
      <ProjectLink uuid={node.project_id}>{node.project_id}</ProjectLink>
    ),
  },
  {
    name: 'Disease Type',
    id: 'disease_type',
    sortable: false,
    downloadable: true,
    th: () => 'Disease Type',
    td: ({ node }) => (
      <CollapsibleRowList data={node.disease_type} label={'Disease Types'} />
    ),
  },
  {
    name: 'Site',
    id: 'site',
    sortable: false,
    downloadable: true,
    th: () => 'Site',
    td: ({ node }) => (
      <CollapsibleRowList data={node.site} label={'Primary Sites'} />
    ),
  },
  {
    name: 'Affected Cases',
    id: 'num_affected_cases_percent',
    sortable: false,
    downloadable: true,
    th: ({ sorted, ...props }) => (
      <Row {...props}>
        <Tooltip
          Component={
            <span>
              # Cases tested for Simple Somatic Mutations in Project affected
              by&nbsp;
              {entityName}&nbsp; / # Cases tested for Simple Somatic Mutations
              in Project
            </span>
          }
          style={tableToolTipHint()}
          >
          # SSM Affected Cases
          {sorted[0] && <ArrowIcon sorted={sorted[0].order} />}
        </Tooltip>
      </Row>
    ),
    td: ({ node }) => (
      <span>
        <ExploreSSMLink
          merge
          searchTableTab={'cases'}
          filters={replaceFilters(makeProjectFilters(node.project_id), filters)}
        >
          {node.num_affected_cases}
        </ExploreSSMLink>
        <span> / </span>
        <ExploreLink
          query={{
            searchTableTab: 'cases',
            filters: makeProjectFilters(node.project_id),
          }}
        >
          {node.num_affected_cases_total.toLocaleString()}
        </ExploreLink>
        <span>
          &nbsp;({(node.num_affected_cases_percent * 100).toFixed(2)}%)
        </span>
      </span>
    ),
  },
  ...((tableType !== 'ssm'
    ? [
        {
          name: 'CNV Gains',
          id: 'num_cnv_gain',
          sortable: true,
          downloadable: true,
        th: ({ sorted, ...props }) => (
            <Row {...props}>
              <Tooltip
                Component={
                  <span>
                    # of Cases tested for CNV in Project affected by CNV loss
                    event in&nbsp;
                    {entityName}&nbsp; / # of Cases tested for Copy Number
                    Variation in Project
                  </span>
                }
                style={tableToolTipHint()}
              >
              # CNV Gains
              {sorted[0] && <ArrowIcon sorted={sorted[0].order} />}
            </Tooltip>
          </Row>
        ),
        td: ({ node }) => (
            <span>
              {node.num_cnv_gain.toLocaleString()}
              <span> / </span>
              {node.num_cnv_cases_total.toLocaleString()}
              <span>
                &nbsp;({(node.num_cnv_gain_percent * 100).toFixed(2)}%)
              </span>
            </span>
          ),
        },
        {
          name: 'CNV Losses',
          id: 'num_cnv_loss',
          sortable: true,
          downloadable: true,
        th: ({ sorted, ...props }) => (
            <Row {...props}>
              <Tooltip
                Component={
                  <span>
                    # of Cases tested for CNV in Project affected by CNV loss
                    event in&nbsp;
                    {entityName}&nbsp; / # of Cases tested for Copy Number
                    Variation in Project
                  </span>
                }
                style={tableToolTipHint()}
              >
              # CNV Losses
              {sorted[0] && <ArrowIcon sorted={sorted[0].order} />}
            </Tooltip>
          </Row>
        ),
        td: ({ node }) => (
            <span>
              {node.num_cnv_loss.toLocaleString()}
              <span> / </span>
              {node.num_cnv_cases_total.toLocaleString()}
              <span>
                &nbsp;({(node.num_cnv_loss_percent * 100).toFixed(2)}%)
              </span>
            </span>
          ),
        },
      ]
    : []) as IModelEntry[]),
  ...((geneId
    ? [
        {
          name: 'Mutations',
          id: 'num_mutations',
          sortable: false,
          downloadable: true,
        th: ({ sorted, ...props }) => (
          <Row {...props}>
            <Tooltip
              Component={(
                <span>
                  {`# Unique Simple Somatic Mutations observed in ${entityName} in Project`}
                </span>
              )}
              style={tableToolTipHint()}
              >
              # Mutations
              {sorted[0] && <ArrowIcon sorted={sorted[0].order} />}
            </Tooltip>
          </Row>
        ),
        td: ({ node }) => (
          <MutationsCount
            filters={replaceFilters(
              makeProjectFilters(node.project_id),
              filters,
            )}
            ssmCount={ssmCount(aggregations, node.project_id)}
            />
          ),
        },
      ]
    : []) as IModelEntry[]),
];

export default CancerDistributionTableModel;

const CollapsibleRowList: React.ComponentType<{
  data: Array<{}>;
  label: string;
}> = props => {
  const { data, label } = props;

  if (!data.length) {
    return <GreyBox />;
  }

  return (
    <span>
      {data.length > 1 && (
        <CollapsibleList
          liStyle={{ whiteSpace: 'normal', listStyleType: 'disc' }}
          toggleStyle={{ fontStyle: 'normal' }}
          data={data.slice(0).sort()}
          limit={0}
          expandText={`${data.length} ` + label}
          collapseText="collapse"
        />
      )}
      {data.length === 1 && data[0]}
    </span>
  );
};

const makeProjectFilters = (id: string) =>
  makeFilter([
    {
      field: 'cases.project.project_id',
      value: id,
    },
    {
      field: 'cases.available_variation_data',
      value: 'ssm',
    },
  ]);

const ssmCount = (aggregations: IAggregations, id: string) =>
  (aggregations || {
    occurrence__case__project__project_id: { buckets: [] },
  }).occurrence__case__project__project_id.buckets.reduce(
    (acc: { [key: string]: number }, b: IBucket) => ({
      ...acc,
      [b.key]: b.doc_count,
    }),
    {}
  )[id];
