// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { parse } from 'query-string';
import { withRouter } from 'react-router-dom';
import { parseIntParam, parseFilterParam } from '@ncigdc/utils/uri';
import { compose, withPropsOnChange } from 'recompose';
import Query from '@ncigdc/modern_components/Query';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      ['location'],
      ({ location: { search }, match: { params }, defaultSize = 10 }) => {
        const q = parse(search);
        return {
          variables: {
            filters: addInFilters(
              parseFilterParam(q.filters, null),
              makeFilter([
                { field: 'cases.project.project_id', value: ['TCGA-BRCA'] }, //TODO remove this when other projects slides processed
              ]),
            ),
            cases_offset: parseIntParam(q.cases_offset, 0),
            cases_size: parseIntParam(q.cases_size, defaultSize),
          },
        };
      },
    ),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        minHeight={350}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query ImageViewer_relayQuery(
            $filters: FiltersArgument
            $cases_size: Int
            $cases_offset: Int
          ) {
            viewer {
              repository {
                cases {
                  hits(
                    filters: $filters
                    first: $cases_size
                    offset: $cases_offset
                  ) {
                    total
                    edges {
                      cursor
                      node {
                        id
                        case_id
                        submitter_id
                        project {
                          project_id
                        }
                        samples {
                          hits(first: 99) {
                            edges {
                              node {
                                portions {
                                  hits(first: 99) {
                                    edges {
                                      node {
                                        slides {
                                          hits(first: 99) {
                                            edges {
                                              node {
                                                submitter_id
                                                slide_id
                                                percent_tumor_nuclei
                                                percent_monocyte_infiltration
                                                percent_normal_cells
                                                percent_stromal_cells
                                                percent_eosinophil_infiltration
                                                percent_lymphocyte_infiltration
                                                percent_neutrophil_infiltration
                                                section_location
                                                percent_granulocyte_infiltration
                                                percent_necrosis
                                                percent_inflam_infiltration
                                                number_proliferating_cells
                                                percent_tumor_cells
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `}
      />
    );
  });
