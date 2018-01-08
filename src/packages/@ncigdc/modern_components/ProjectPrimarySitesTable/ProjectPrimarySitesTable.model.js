// @flow
import React from 'react';
import {
  RepositoryCasesLink,
  RepositoryFilesLink,
} from '@ncigdc/components/Links/RepositoryLink';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import { Th, Td, ThNum, TdNum } from '@ncigdc/uikit/Table';
import { makeFilter } from '@ncigdc/utils/filters';
import formatFileSize from '@ncigdc/utils/formatFileSize';
import withRouter from '@ncigdc/utils/withRouter';
import { createDataCategoryColumns } from '@ncigdc/tableModels/utils';
import CollapsibleList from '@ncigdc/uikit/CollapsibleList';
import withData from '@ncigdc/modern_components/CasesByPrimarySite/CasesByPrimarySite.relay';
import Button from '@ncigdc/uikit/Button';
import { stringifyJSONParam } from '@ncigdc/utils/uri';

let DiseaseList = withData(props => {
  const { buckets } = props.repository.cases.aggregations.disease_type;
  const diseasesByName = buckets.map(type => type.key);
  return (
    <span>
      {buckets.length > 1 && (
        <CollapsibleList
          liStyle={{ whiteSpace: 'normal', listStyleType: 'disc' }}
          toggleStyle={{ fontStyle: 'normal' }}
          data={diseasesByName.slice(0).sort()}
          limit={0}
          expandText={`${buckets.length} Disease Types`}
          collapseText="collapse"
        />
      )}
      {buckets.length <= 1 && buckets[0].key}
    </span>
  );
});

let FilesByPrimarySite = withData(props => {
  return (
    <TdNum>
      <RepositoryFilesLink
        query={{
          // needs primary site as filter too
          filters: makeFilter([
            {
              field: 'cases.project.project_id',
              value: props.projectId,
            },
          ]),
        }}
      >
        {props.repository.cases.aggregations.disease_type.buckets[0].doc_count}
      </RepositoryFilesLink>
    </TdNum>
  );
});

let ExploreByPrimarySiteButton = withRouter(props => {
  return (
    <Button
      onClick={() => {
        props.push({
          pathname: '/exploration',
          query: {
            filters: stringifyJSONParam(
              makeFilter([
                {
                  field: 'cases.project.project_id',
                  value: props.projectId,
                },
                {
                  field: 'cases.primary_site',
                  value: props.primarySite,
                },
              ]),
            ),
          },
        });
      }}
    >
      Explore
    </Button>
  );
});

type TLinkProps = { node: Object, fields?: Array<Object>, children?: mixed };
type TLink = (props: TLinkProps) => any;

const dataCategoryColumns = createDataCategoryColumns({
  title: 'Available Cases per Data Category',
  countKey: 'case_count',
  Link: RepositoryCasesLink,
  getCellLinkFilters: node => [
    {
      field: 'cases.project.project_id',
      value: node.project_id,
    },
  ],
  getTotalLinkFilters: hits => [
    {
      field: 'cases.project.project_id',
      value: hits.edges.map(({ node: p }) => p.project_id),
    },
  ],
});

const CasesLink: TLink = ({ node, fields = [], children }) =>
  children === '0' ? (
    <span>0</span>
  ) : (
    <RepositoryCasesLink
      query={{
        filters: makeFilter([
          { field: 'cases.project.project_id', value: [node.project_id] },
          ...fields,
        ]),
      }}
    >
      {children}
    </RepositoryCasesLink>
  );

const getProjectIdFilter = projects =>
  makeFilter([
    {
      field: 'cases.project.project_id',
      value: projects.edges.map(({ node: p }) => p.project_id),
    },
  ]);

const projectPrimarySitesTableModel = [
  {
    name: 'Primary Site',
    id: 'primary_site',
    sortable: false,
    downloadable: false,
    th: () => <Th rowSpan="2">Primary Site</Th>,
    td: ({ primarySite }) => (
      <Td
        key="primary_site"
        style={{
          maxWidth: '200px',
          padding: '3px 15px 3px 3px',
          whiteSpace: 'normal',
        }}
      >
        {primarySite}
      </Td>
    ),
  },
  {
    name: 'Disease Type',
    id: 'disease_type',
    sortable: false,
    downloadable: false,
    th: () => <Th rowSpan="2">Disease Type</Th>,
    td: ({ primarySite }) => (
      <Td
        key={primarySite}
        style={{
          maxWidth: '200px',
          padding: '3px 15px 3px 3px',
          whiteSpace: 'normal',
        }}
      >
        <DiseaseList primarySite={primarySite} />
      </Td>
    ),
  },
  // ...dataCategoryColumns,
  {
    name: 'Files',
    id: 'file_count',
    sortable: false,
    downloadable: false,
    th: () => <ThNum rowSpan="2">Files</ThNum>,
    td: ({ primarySite, projectId }) => (
      <Td
        key="file_count"
        style={{
          maxWidth: '200px',
          padding: '3px 15px 3px 3px',
          whiteSpace: 'normal',
        }}
      >
        <FilesByPrimarySite primarySite={primarySite} projectId={projectId} />
      </Td>
    ),
    // total: withRouter(({ hits, query }) => (
    //   <TdNum>
    //     <RepositoryFilesLink
    //       query={{
    //         filters: query.filters ? getProjectIdFilter(hits) : null,
    //       }}
    //     >
    //       {hits.edges
    //         .reduce((acc, val) => acc + val.node.summary.file_count, 0)
    //         .toLocaleString()}
    //     </RepositoryFilesLink>
    //   </TdNum>
    // )),
  },
  {
    name: 'Explore',
    id: 'explore',
    sortable: false,
    downloadable: false,
    th: () => <ThNum rowSpan="2" />,
    td: ({ primarySite, projectId }) => (
      <Td
        key="explore"
        style={{
          maxWidth: '200px',
          padding: '3px 15px 3px 3px',
          whiteSpace: 'normal',
        }}
      >
        <ExploreByPrimarySiteButton
          primarySite={primarySite}
          projectId={projectId}
        />
      </Td>
    ),
  },
  // {
  //   name: 'File size',
  //   id: 'summary.file_size',
  //   sortable: false,
  //   hidden: true,
  //   downloadable: false,
  //   th: () => <ThNum rowSpan="2">File Size</ThNum>,
  //   td: ({ node }) => <TdNum>{formatFileSize(node.summary.file_size)}</TdNum>,
  //   total: ({ hits }) => (
  //     <TdNum>
  //       {formatFileSize(
  //         hits.edges.reduce((acc, val) => acc + val.node.summary.file_size, 0),
  //       )}
  //     </TdNum>
  //   ),
  // },
];

export default projectPrimarySitesTableModel;
