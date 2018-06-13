/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';

import SearchPage from '@ncigdc/components/SearchPage';
import ProjectsCharts from '@ncigdc/modern_components/ProjectsCharts';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import GitHut from '@ncigdc/components/GitHut';
import { Column } from '@ncigdc/uikit/Flex';
import ProjectsTable from '@ncigdc/modern_components/ProjectsTable';
import ProjectAggregations from './ProjectAggregations';
import { AWG } from '@ncigdc/utils/constants';

export type TProps = {
  relay: Object,
  viewer: {
    autocomplete: {
      hits: Array<Object>,
    },
    projects: {
      aggregations: string,
      hits: string,
    },
  },
  showFacets: boolean,
  setShowFacets: Function,
};

export const ProjectsPageComponent = (props: TProps) => (
  <SearchPage
    className="test-projects-page"
    filtersLinkProps={{
      linkPathname: '/repository',
      linkText: 'Open Query in Repository',
      linkFieldMap: (field: string) => {
        if (field.indexOf('projects.summary') > -1) {
          return `files.${field.split('.').pop()}`;
        }

        if (
          field.indexOf('projects.primary_site') > -1 ||
          field.indexOf('projects.disease_type') > -1
        ) {
          return field.replace('projects', 'cases');
        }

        return field.replace(/^projects/, 'cases.project');
      },
    }}
    facetTabs={[
      {
        id: 'projects',
        text: 'Projects',
        component: (
          <ProjectAggregations
            aggregations={props.viewer.projects.aggregations}
          />
        ),
      },
    ]}
    results={
      <Column spacing="2rem">
        {AWG === 'false' && <ProjectsCharts />}
        <TabbedLinks
          queryParam="projectsTableTab"
          defaultIndex={0}
          links={[
            {
              id: 'table',
              text: 'Table',
              component: <ProjectsTable />,
            },
            ...(AWG === 'false'
              ? [
                  {
                    id: 'graph',
                    text: 'Graph',
                    component: <GitHut params={props.relay.route.params} />,
                  },
                ]
              : []),
          ]}
        />
      </Column>
    }
  />
);

export const ProjectsPageQuery = {
  initialVariables: {
    size: 1000,
    offset: null,
    filters: null,
    sort: null,
    idAutocomplete: null,
    runAutocomplete: false,
    projects_sort: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        projects {
          aggregations(filters: $filters aggregations_filter_themselves: false) {
            ${ProjectAggregations.getFragment('aggregations')}
          }
        }
      }
    `,
  },
};

const ProjectsPage = Relay.createContainer(
  ProjectsPageComponent,
  ProjectsPageQuery,
);

export default ProjectsPage;
