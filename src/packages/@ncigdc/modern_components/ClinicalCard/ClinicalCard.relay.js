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
      renderComponent(() => <div><pre>caseId</pre> must be provided</div>),
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
        name="ClinicalCard"
        minHeight={249}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query ClinicalCard_relayQuery(
            $filters: FiltersArgument
          ) {
            viewer {
              repository {
                cases {
                  hits(first: 1, filters: $filters) {
                    edges {
                      node {
                        case_id
                        demographic {
                          demographic_id
                          ethnicity
                          gender
                          race
                          year_of_birth
                          year_of_death
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
                                days_to_birth
                                days_to_death
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
                                vital_status
                                treatments {
                                  hits(first: 99) {
                                    edges {
                                      node {
                                        treatment_id
                                        therapeutic_agents
                                        treatment_intent_type
                                        treatment_or_therapy
                                        days_to_treatment
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
                                cigarettes_per_day
                                weight
                                updated_datetime
                                alcohol_history
                                alcohol_intensity
                                bmi
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
