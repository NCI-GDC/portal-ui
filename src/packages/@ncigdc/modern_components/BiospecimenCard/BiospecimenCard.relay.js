// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    branch(
      ({ caseId }) => !caseId,
      renderComponent(() => (
        <div>
          <pre>caseId</pre> must be provided
        </div>
      )),
    ),
    withPropsOnChange(['caseId'], ({ caseId }) => {
      return {
        variables: {
          filters: makeFilter([
            {
              field: 'cases.case_id',
              value: [caseId],
            },
          ]),
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        minHeight={249}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query BiospecimenCard_relayQuery($filters: FiltersArgument) {
            viewer {
              repository {
                cases {
                  hits(first: 1, filters: $filters) {
                    edges {
                      node {
                        case_id
                        samples {
                          hits(first: 99) {
                            total
                            edges {
                              node {
                                submitter_id
                                sample_id
                                sample_type
                                sample_type_id
                                tissue_type
                                tumor_code
                                tumor_code_id
                                oct_embedded
                                shortest_dimension
                                intermediate_dimension
                                longest_dimension
                                is_ffpe
                                pathology_report_uuid
                                tumor_descriptor
                                current_weight
                                initial_weight
                                composition
                                time_between_clamping_and_freezing
                                time_between_excision_and_freezing
                                days_to_sample_procurement
                                freezing_method
                                preservation_method
                                days_to_collection
                                portions {
                                  hits(first: 99) {
                                    total
                                    edges {
                                      node {
                                        submitter_id
                                        portion_id
                                        portion_number
                                        weight
                                        is_ffpe
                                        analytes {
                                          hits(first: 99) {
                                            total
                                            edges {
                                              node {
                                                submitter_id
                                                analyte_id
                                                analyte_type
                                                analyte_type_id
                                                well_number
                                                amount
                                                a260_a280_ratio
                                                concentration
                                                spectrophotometer_method
                                                aliquots {
                                                  hits(first: 99) {
                                                    total
                                                    edges {
                                                      node {
                                                        submitter_id
                                                        aliquot_id
                                                        source_center
                                                        amount
                                                        concentration
                                                        analyte_type
                                                        analyte_type_id
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                        slides {
                                          hits(first: 99) {
                                            total
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
