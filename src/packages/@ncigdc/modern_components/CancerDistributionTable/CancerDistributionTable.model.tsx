import React from 'react';
import { Th, Td, TTd } from '@ncigdc/uikit/Table';
import { Row } from '@ncigdc/uikit/Flex';
import { makeFilter, replaceFilters } from '@ncigdc/utils/filters';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import MutationsCount from '@ncigdc/components/MutationsCount';
import ExploreSSMLink from '@ncigdc/components/Links/ExploreSSMLink';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import CollapsibleList from '@ncigdc/uikit/CollapsibleList';
import GreyBox from '@ncigdc/uikit/GreyBox';
import { INode, ICancerDistributionTableProps, IBucket } from './types';

type TNode = ({ node }: { node: INode }) => TTd | JSX.Element;

interface IModelEntry {
  name: string;
  id: string;
  sortable: boolean;
  downloadable: boolean;
  hidden?: boolean;
  th: TNode;
  td: TNode;
}

type TCancerDistributionTableModel = (
  props: ICancerDistributionTableProps
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
    th: () => <Th>Project Id</Th>,
    td: ({ node }) => <Td>{node.project_id}</Td>,
  },
  {
    name: 'Nymber of Affected Cases',
    id: 'num_affected_cases_percent',
    sortable: true,
    downloadable: true,
    hidden: true,
    th: () => <Th>Affected Cases</Th>,
    td: ({ node }) => <Td>{node.num_affected_cases_percent}</Td>,
  },
  {
    name: 'Project Id',
    id: 'project_id',
    sortable: false,
    downloadable: false,
    th: () => <Th>Project</Th>,
    td: ({ node }) => (
      <Td>
        <ProjectLink uuid={node.project_id}>{node.project_id}</ProjectLink>
      </Td>
    ),
  },
  {
    name: 'Disease Type',
    id: 'disease_type',
    sortable: false,
    downloadable: true,
    th: () => <Th>Disease Type</Th>,
    td: ({ node }) => (
      <Td>
        <CollapsibleRowList data={node.disease_type} label={'Disease Types'} />
      </Td>
    ),
  },
  {
    name: 'Site',
    id: 'site',
    sortable: false,
    downloadable: true,
    th: () => <Th>Disease Type</Th>,
    td: ({ node }) => (
      <Td>
        <CollapsibleRowList data={node.site} label={'Primary Sites'} />
      </Td>
    ),
  },
  {
    name: 'Affected Cases',
    id: 'num_affected_cases',
    sortable: false,
    downloadable: true,
    th: () => <Th># SSM Affected Cases</Th>,
    td: ({ node }) => (
      <Td>
        <span>
          <ExploreSSMLink
            merge
            searchTableTab={'cases'}
            filters={replaceFilters(
              makeProjectFilters(node.project_id),
              filters
            )}
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
        </span>{' '}
      </Td>
    ),
  },
  ...((tableType !== 'ssm'
    ? [
        {
          name: 'CNV Gain',
          id: 'cnv_gain',
          sortable: true,
          downloadable: true,
          th: () => (
            <Th>
              <Row>
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
                </Tooltip>
              </Row>
            </Th>
          ),
          td: ({ node }) => (
            <Td>
              <span>
                {node.num_cnv_gain.toLocaleString()}
                <span> / </span>
                {node.num_cnv_cases_total.toLocaleString()}
                <span>
                  &nbsp;({(node.num_cnv_gain_percent * 100).toFixed(2)}%)
                </span>
              </span>
            </Td>
          ),
        },
        {
          name: 'CNV Loss',
          id: 'cnv_loss',
          sortable: true,
          downloadable: true,
          th: () => (
            <Th>
              <Row>
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
                </Tooltip>
              </Row>
            </Th>
          ),
          td: ({ node }) => (
            <Td>
              <span>
                {node.num_cnv_loss.toLocaleString()}
                <span> / </span>
                {node.num_cnv_cases_total.toLocaleString()}
                <span>
                  &nbsp;({(node.num_cnv_loss_percent * 100).toFixed(2)}%)
                </span>
              </span>
            </Td>
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
          th: () => (
            <Th>
              <Tooltip
                Component={
                  <span>
                    # Unique Simple Somatic Mutations observed in {entityName}
                    in Project
                  </span>
                }
                style={tableToolTipHint()}
              >
                # Mutations
              </Tooltip>
            </Th>
          ),
          td: ({ node }) => (
            <Td>
              <MutationsCount
                ssmCount={(aggregations || {
                  occurrence__case__project__project_id: { buckets: [] },
                }).occurrence__case__project__project_id.buckets.reduce(
                  (acc: { [key: string]: number }, b: IBucket) => ({
                    ...acc,
                    [b.key]: b.doc_count,
                  }),
                  {}
                )}
                filters={replaceFilters(
                  makeProjectFilters(node.project_id),
                  filters
                )}
              />
            </Td>
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
