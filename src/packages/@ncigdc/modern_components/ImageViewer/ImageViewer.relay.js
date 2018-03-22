// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { parse } from 'query-string';
import { withRouter } from 'react-router-dom';
import { parseIntParam, parseFilterParam } from '@ncigdc/utils/uri';
import { compose, withPropsOnChange, withProps, withState } from 'recompose';
import Query from '@ncigdc/modern_components/Query';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    //withProps(({ location: { search } }) => ({
    //query: parse(search),
    //defaultSize: 10,
    //})),
    withPropsOnChange(
      ['location'],
      ({ location: { search }, defaultSize = 10 }) => {
        const query = parse(search);
        return {
          offset: parseIntParam(query.cases_offset, 0),
          size: parseIntParam(query.cases_size, defaultSize),
          filters: query.filters,
        };
      },
    ),
    withProps(({ offset, size }) => ({
      firstLoadSize: offset > 0 ? offset + size : size,
    })),
    withState('firstLoad', 'setFirstLoad', true),
    withPropsOnChange(
      ['offset', 'size', 'filters', 'fileId'],
      ({
        filters,
        offset,
        size,
        defaultSize,
        firstLoad,
        setFirstLoad,
        firstLoadSize,
        fileId,
      }) => {
        const parsedFilters = parseFilterParam(filters, null);
        let slideFilters = [
          {
            field: 'files.data_type',
            value: ['Slide Image'],
          },
          {
            field: 'files.access',
            value: ['open'],
          },
        ];
        let caseFilters = {
          op: 'and',
          content: [
            {
              op: 'not',
              content: {
                field: 'cases.slide_ids',
                value: ['MISSING'],
              },
            },
            {
              op: 'in',
              content: {
                field: 'files.data_type',
                value: ['Slide Image'],
              },
            },
          ],
        };

        if (fileId) {
          caseFilters = {
            ...caseFilters,
            content: [
              ...caseFilters.content,
              {
                op: 'in',
                content: {
                  field: 'files.file_id',
                  value: fileId,
                },
              },
            ],
          };
          slideFilters = [
            ...slideFilters,
            {
              field: 'files.file_id',
              value: fileId,
            },
          ];
        }
        const newProps = {
          variables: {
            filters: addInFilters(parsedFilters, caseFilters),
            slideFilter: makeFilter(slideFilters),
            cases_offset: offset,
            cases_size: firstLoad ? firstLoadSize : size,
          },
        };

        setFirstLoad(false);
        return newProps;
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
            $slideFilter: FiltersArgument
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
                        files {
                          hits(filters: $slideFilter, first: 99) {
                            edges {
                              node {
                                file_id
                                submitter_id
                              }
                            }
                          }
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
