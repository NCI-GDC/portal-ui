/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import Project from '@ncigdc/components/Project';

import {
  EXPERIMENTAL_STRATEGIES,
  DATA_CATEGORIES,
} from '@ncigdc/utils/constants';

import type { TRawQuery } from '@ncigdc/utils/uri/types';

export type TProps = {
  viewer: {
    repository: {
      cases: {
        clinicalHits: {
          total: number,
        },
        biospecimentHits: {
          total: number,
        },
      },
    },
    annotations: {
      hits: {
        edges: [
          {
            node: {
              annotation_id: string,
            },
          },
        ],
        total: number,
      },
    },
  },
  node: {
    disease_type: string,
    name: string,
    primary_site: string,
    program: {
      name: string,
    },
    project_id: string,
    summary: {
      case_count: number,
      data_categories: Array<{
        case_count: number,
        data_category: string,
        file_count: number,
      }>,
      experimental_strategies: Array<{
        case_count: number,
        experimental_strategy: string,
        file_count: number,
      }>,
      file_count: number,
    },
  },
};

export const ProjectPageComponent = ({ node, viewer }: TProps) =>
  <FullWidthLayout
    title={node.project_id}
    entityType="PR"
    data-test="project-page"
  >
    <LocationSubscriber>
      {(ctx: {| pathname: string, query: TRawQuery |}) =>
        <Project
          viewer={viewer}
          query={ctx.query}
          clinicalCount={viewer.repository.cases.clinicalHits.total}
          biospecimenCount={viewer.repository.cases.biospecimentHits.total}
          totalAnnotations={viewer.annotations.hits.total || 0}
          annotations={viewer.annotations.hits.edges.map(e => e.node)}
          caseCount={node.summary.case_count}
          fileCount={node.summary.file_count}
          projectId={node.project_id}
          projectName={node.name}
          programName={node.program.name}
          diseaseType={[].concat(node.disease_type || [])}
          primarySite={[].concat(node.primary_site || [])}
          dataCategories={Object.keys(DATA_CATEGORIES).reduce((acc, key) => {
            const type = node.summary.data_categories.find(
              item => item.data_category === DATA_CATEGORIES[key].full,
            );

            return acc.concat(
              type || {
                data_category: DATA_CATEGORIES[key].full,
                file_count: 0,
                case_count: 0,
              },
            );
          }, [])}
          experimentalStrategies={EXPERIMENTAL_STRATEGIES.reduce(
            (acc, name) => [
              ...acc,
              ...node.summary.experimental_strategies.filter(
                item => item.experimental_strategy.toLowerCase() === name,
              ),
            ],
            [],
          )}
        />}
    </LocationSubscriber>
  </FullWidthLayout>;

export const ProjectPageQuery = {
  initialVariables: {
    clinicalFilters: null,
    biospecimenFilters: null,
    annotationsFilters: null,
    mutatedFilters: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        repository {
          cases {
            biospecimentHits: hits(first: 0, filters: $biospecimenFilters){
              total
            }
            clinicalHits: hits(first: 0, filters: $clinicalFilters){
              total
            }
          }
        }
        explore {
          cases {
            mutatedCases: hits(first: 0, filters: $mutatedFilters) {
              total
            }
          }
        }
        annotations {
          hits(first: 1 filters: $annotationsFilters) {
            total
            edges {
              node {
                annotation_id
              }
            }
          }
        }
      }
    `,
    gene: () => Relay.QL`
      fragment on Gene {
        gene_id
      }
    `,
    node: () => Relay.QL`
      fragment on Project {
        project_id
        name
        disease_type
        program {
          name
        }
        primary_site
        summary {
          case_count
          file_count
          experimental_strategies {
            experimental_strategy
            file_count
            case_count
          }
          data_categories {
            data_category
            file_count
            case_count
          }
        }
      }
    `,
  },
};

const ProjectPage = Relay.createContainer(
  ProjectPageComponent,
  ProjectPageQuery,
);

export default ProjectPage;
