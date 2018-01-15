/* @flow */
import React from 'react';
import { RepositoryFilesLink } from '@ncigdc/components/Links/RepositoryLink';
import { Th, Td, ThNum } from '@ncigdc/uikit/Table';
import { makeFilter } from '@ncigdc/utils/filters';
import withRouter from '@ncigdc/utils/withRouter';
import CollapsibleList from '@ncigdc/uikit/CollapsibleList';
import withData from '@ncigdc/modern_components/DiseaseListByPrimarySite/DiseaseListByPrimarySite.relay.js';
import Button from '@ncigdc/uikit/Button';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import { DATA_CATEGORIES } from '@ncigdc/utils/constants';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import Tooltip from '@ncigdc/uikit/Tooltip/Tooltip';

let DataCategoryColumns = withData(props => {
  var dataColumns = Object.keys(DATA_CATEGORIES).reduce((acc, k) => {
    const type = props.repository.cases.aggregations.files__data_category.buckets.find(
      item => item.key === DATA_CATEGORIES[k].full,
    );
    const linkQuery = {
      searchTableTab: 'cases',
      filters: makeFilter([
        {
          field: 'cases.project.project_id',
          value: props.projectId,
        },
        { field: 'files.data_category', value: DATA_CATEGORIES[k].full },
        {
          field: 'cases.primary_site',
          value: props.primarySite,
        },
      ]),
    };
    return acc.concat(
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          minWidth: '80px',
        }}
        key={k}
      >
        {type ? (
          <RepositoryFilesLink query={linkQuery}>
            {type.doc_count}{' '}
          </RepositoryFilesLink>
        ) : (
          <span>0 </span>
        )}

        <abbr
          style={{
            fontSize: '1rem',
            fontVariantPosition: 'super',
            paddingLeft: '5px',
          }}
        >
          <Tooltip
            Component={DATA_CATEGORIES[k].full}
            style={tableToolTipHint()}
          >
            {DATA_CATEGORIES[k].abbr}
          </Tooltip>
        </abbr>
      </div>,
    );
  }, []);
  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      {dataColumns}
    </span>
  );
});

let DiseaseList = withData(props => {
  const { buckets } = props.repository.cases.aggregations.disease_type;
  const diseasesByName = buckets.map(type => type.key).sort();
  return (
    <span>
      {diseasesByName.length > 1 && (
        <CollapsibleList
          liStyle={{ whiteSpace: 'normal', listStyleType: 'disc' }}
          toggleStyle={{ fontStyle: 'normal' }}
          data={diseasesByName.slice(0).sort()}
          limit={0}
          expandText={`${diseasesByName.length} Disease Types`}
          collapseText="collapse"
        />
      )}
      {diseasesByName.length <= 1 && diseasesByName[0]}
    </span>
  );
});

let FilesByPrimarySite = withData(props => {
  return (
    <span
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        minWidth: '60px',
      }}
    >
      {props.repository.cases.aggregations.disease_type.buckets &&
      props.repository.cases.aggregations.disease_type.buckets.length ? (
        <RepositoryFilesLink
          query={{
            filters: makeFilter([
              {
                field: 'cases.project.project_id',
                value: props.projectId,
              },
              {
                field: 'cases.primary_site',
                value: props.primarySite,
              },
            ]),
          }}
        >
          {props.repository.cases.aggregations.disease_type.buckets.reduce(
            (acc, { doc_count }) => acc + doc_count,
            0,
          )}
        </RepositoryFilesLink>
      ) : (
        0
      )}
    </span>
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

const projectPrimarySitesTableModel = [
  {
    name: 'Primary Site',
    id: 'primary_site',
    sortable: false,
    downloadable: false,
    th: () => <Th rowSpan="2">Primary Site</Th>,
    td: ({ primarySite, projectId, searchValue }) => (
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
    td: ({ primarySite, projectId }) => {
      return (
        <Td
          key="disease_type"
          style={{
            maxWidth: '200px',
            padding: '3px 15px 3px 3px',
            whiteSpace: 'normal',
          }}
        >
          <DiseaseList projectId={projectId} primarySite={primarySite} />
        </Td>
      );
    },
  },
  {
    name: 'Data Categories',
    id: 'data_categories',
    sortable: false,
    downloadable: false,
    th: ({ primarySite, projectId }) => (
      <Th rowSpan="2" style={{ textAlign: 'center' }}>
        Available Cases per Data Category
      </Th>
    ),
    td: ({ primarySite, projectId }) => (
      <Td>
        <DataCategoryColumns primarySite={primarySite} projectId={projectId} />
      </Td>
    ),
  },
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
          padding: '3px 15px 3px 15px',
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
];

export default projectPrimarySitesTableModel;
