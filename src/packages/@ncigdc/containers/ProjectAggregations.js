/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import { compose, withState } from 'recompose';

import SuggestionFacet from '@ncigdc/modern_components/SuggestionFacet';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';

import { IBucket } from '@ncigdc/components/Aggregations/types';

import { withTheme } from '@ncigdc/theme';
import { Row } from '@ncigdc/uikit/Flex';
import FolderIcon from '@ncigdc/theme/icons/Folder';

export type TProps = {
  suggestions: Array<Object>,
  aggregations: {
    disease_type: { buckets: [IBucket] },
    primary_site: { buckets: [IBucket] },
    program__name: { buckets: [IBucket] },
    project_id: { buckets: [IBucket] },
    summary__data_categories__data_category: { buckets: [IBucket] },
    summary__experimental_strategies__experimental_strategy: {
      buckets: [IBucket],
    },
  },
  setAutocomplete: Function,
  theme: Object,
};

const projectFacets = [
  {
    title: 'Primary Site',
    field: 'primary_site',
    full: 'projects.primary_site',
    doc_type: 'project',
    type: 'keyword',
  },
  {
    title: 'Program',
    field: 'program.name',
    full: 'projects.program.name',
    doc_type: 'project',
    type: 'keyword',
  },
  {
    title: 'Disease Type',
    field: 'disease_type',
    full: 'projects.disease_type',
    doc_type: 'project',
    type: 'keyword',
  },
  {
    title: 'Data Category',
    field: 'summary.data_categories.data_category',
    full: 'projects.summary.data_categories.data_category',
    doc_type: 'project',
    type: 'keyword',
  },
  {
    title: 'Experimental Strategy',
    field: 'summary.experimental_strategies.experimental_strategy',
    full: 'projects.summary.experimental_strategies.experimental_strategy',
    doc_type: 'project',
    type: 'keyword',
  },
];

export const ProjectAggregationsComponent = compose(
  withState('projectIdCollapsed', 'setProjectIdCollapsed', false),
)((props: TProps) => (
  <div className="test-project-aggregations">
    <FacetHeader
      collapsed={props.projectIdCollapsed}
      description="Enter Project ID, Project name, Disease Type or Primary Site"
      field="projects.project_id"
      setCollapsed={props.setProjectIdCollapsed}
      title="Project" />
    <SuggestionFacet
      collapsed={props.projectIdCollapsed}
      doctype="projects"
      dropdownItem={x => (
        <Row>
          <FolderIcon style={{
            paddingRight: '1rem',
            paddingTop: '1rem',
          }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{x.name}</div>
            {x.project_id}
            <br />
            {x.primary_site}
          </div>
        </Row>
      )}
      fieldNoDoctype="project_id"
      placeholder="e.g. TCGA-GBM, Brain"
      queryType="project"
      title="Project" />
    {projectFacets.map(facet => (
      <FacetWrapper
        additionalProps={facet.additionalProps}
        aggregation={props.aggregations[escapeForRelay(facet.field)]}
        facet={facet}
        key={facet.full}
        relay={props.relay}
        style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
        title={facet.title} />
    ))}
  </div>
));

export const ProjectAggregationsQuery = {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on ProjectAggregations {
        primary_site {
          buckets {
            doc_count
            key
          }
        }
        program__name {
          buckets {
            doc_count
            key
          }
        }
        disease_type {
          buckets {
            doc_count
            key
          }
        }
        project_id {
          buckets {
            doc_count
            key
          }
        }
        summary__experimental_strategies__experimental_strategy {
          buckets {
            doc_count
            key
          }
        }
        summary__data_categories__data_category {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
};

const ProjectAggregations = Relay.createContainer(
  withTheme(ProjectAggregationsComponent),
  ProjectAggregationsQuery,
);

export default ProjectAggregations;
