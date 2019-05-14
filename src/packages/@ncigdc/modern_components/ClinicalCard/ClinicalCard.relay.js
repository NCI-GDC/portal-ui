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
          fileFilters: makeFilter([
            { field: 'cases.case_id', value: [caseId] },
            { field: 'files.data_type', value: ['Clinical Supplement'] },
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
          query ClinicalCard_relayQuery(
            $filters: FiltersArgument
            $fileFilters: FiltersArgument
          ) {
            viewer {
              repository {
                cases {
                  hits(first: 1, filters: $filters) {
                    edges {
                      node {
                        case_id
                        submitter_id
                        project {
                          project_id
                        }
                        files {
                          hits(first: 99, filters: $fileFilters) {
                            edges {
                              node {
                                file_name
                                file_size
                                data_format
                                file_id
                                md5sum
                                acl
                                state
                                access
                              }
                            }
                          }
                        }
                        demographic {
                          demographic_id
                          ethnicity
                          gender
                          race
                          days_to_birth
                          days_to_death
                          vital_status
                        }
                        family_histories {
                          hits(first: 99) {
                            edges {
                              node {
                                family_history_id
                                relationship_age_at_diagnosis
                                relationship_gender
                                relationship_primary_diagnosis
                                relationship_type
                                relative_with_cancer_history
                              }
                            }
                          }
                        }
                        diagnoses {
                          hits(first: 99) {
                            edges {
                              node {
                                diagnosis_id
                                classification_of_tumor
                                age_at_diagnosis
                                days_to_last_follow_up
                                days_to_last_known_disease_status
                                days_to_recurrence
                                last_known_disease_status
                                morphology
                                primary_diagnosis
                                prior_malignancy
                                progression_or_recurrence
                                site_of_resection_or_biopsy
                                tissue_or_organ_of_origin
                                tumor_stage
                                tumor_grade
                                treatments {
                                  hits(first: 99) {
                                    edges {
                                      node {
                                        treatment_id
                                        therapeutic_agents
                                        treatment_intent_type
                                        treatment_or_therapy
                                        days_to_treatment_start
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        exposures {
                          hits(first: 99) {
                            total
                            edges {
                              node {
                                id
                                weight
                                updated_datetime
                                alcohol_history
                                alcohol_intensity
                                years_smoked
                                submitter_id
                                created_datetime
                                tobacco_smoking_quit_year
                                tobacco_smoking_onset_year
                                tobacco_smoking_status
                                exposure_id
                                height
                                pack_years_smoked
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
