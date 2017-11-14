/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';

import SearchPage from '@ncigdc/components/SearchPage';
import ProjectsCharts from '@ncigdc/modern_components/ProjectsCharts';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import GitHut from '@ncigdc/components/GitHut';
import { Column } from '@ncigdc/uikit/Flex';
import ProjectsTable from '@ncigdc/modern_components/ProjectsTable';
import ProjectsAggregations from '@ncigdc/modern_components/ProjectsAggregations';

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
          <ProjectsAggregations
            suggestions={(props.viewer.autocomplete || { hits: [] }).hits}
            setAutocomplete={(value, onReadyStateChange) =>
              props.relay.setVariables(
                { idAutocomplete: value, runAutocomplete: !!value },
                onReadyStateChange,
              )}
          />
        ),
      },
    ]}
    results={
      <Column spacing="2rem">
        {/* <ProjectsCharts /> */}
        <TabbedLinks
          queryParam="projectsTableTab"
          defaultIndex={0}
          links={[
            {
              id: 'table',
              text: 'Table',
              component: <ProjectsTable />,
            },
            // {
            //   id: 'graph',
            //   text: 'Graph',
            //   component: <GitHut params={props.relay.route.params} />,
            // },
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
        autocomplete: query(query: $idAutocomplete types: ["project"]) @include(if: $runAutocomplete) {
          hits {
            id
            ...on Project {
              project_id
              name
              primary_site
            }
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
