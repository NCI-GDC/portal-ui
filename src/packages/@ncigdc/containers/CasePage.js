/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import Case from '@ncigdc/components/Case';
import type { TRawQuery } from '@ncigdc/utils/uri/types';

export type TProps = {
  node: {
    case_id: string,
    files: {
      hits: {
        total: number,
        edges: {
          map: Function,
          node: {
            cases: {
              hits: {
                edges: {
                  node: Object,
                },
              },
            },
          },
        },
      },
    },
    project: {
      disease_type: string,
      name: string,
      primary_site: string,
      program: {
        name: string,
      },
      project_id: string,
    },
    submitter_id: string,
  },
  viewer: {
    explore: {
      cases: {
        hits: {
          edges: Array<{
            node: {
              available_variation_data: Array<string>,
            },
          }>,
        },
        aggregations: {
          project__project_id: {
            buckets: Array<{
              doc_count: number,
              key: string,
            }>,
          },
        },
      },
    },
  },
};

export const CasePageComponent = ({ node, viewer }: TProps) =>
  <FullWidthLayout
    title={`${node.project.project_id} / ${node.submitter_id}`}
    entityType="CA"
  >
    <LocationSubscriber>
      {(ctx: {| pathname: string, query: TRawQuery |}) =>
        <Case
          query={ctx.query}
          node={node}
          totalFiles={node.files.hits.total}
          ssmTested={
            viewer.explore.cases.hits.edges.length &&
            (viewer.explore.cases.hits.edges[0].node.available_variation_data ||
              [])
              .includes('ssm')
          }
          files={node.files.hits.edges.map(f => ({
            ...f.node,
            projects: [node.project.project_id],
          }))}
          numCasesAggByProject={viewer.explore.cases.aggregations.project__project_id.buckets.reduce(
            (acc, b) => ({
              ...acc,
              [b.key]: b.doc_count,
            }),
            {},
          )}
          viewer={viewer}
        />}
    </LocationSubscriber>
  </FullWidthLayout>;

export const CasePageQuery = {
  initialVariables: {
    files_offset: null,
    files_size: null,
    files_sort: null,
    filters: null,
    caseFilters: null,
  },
  fragments: {
    node: () => Relay.QL`
      fragment on Case {
        case_id
        submitter_id
        primary_site
        disease_type
        annotations {
          hits(first: 20) {
            total
            edges {
              node {
                annotation_id
              }
            }
          }
        }
        demographic {
          demographic_id
          ethnicity
          gender
          race
          year_of_birth
          year_of_death
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
            total
          }
        }
        files {
          hits(first: 99) {
            total
            edges {
              node {
                file_id
                access
                file_size
              }
            }
          }
        }
        project {
          project_id
          name
          program {
            name
          }
        }
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
        summary {
          experimental_strategies {
            experimental_strategy
            file_count
          }
          data_categories {
            data_category
            file_count
          }
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on Root {
        explore{
          cases {
            hits(first: 1, filters: $caseFilters) {
              total
              edges {
                node {
                  available_variation_data
                }
              }
            }
            aggregations{
              project__project_id {
                buckets {
                  doc_count
                  key
                }
              }
            }
          }
        }
      }
    `,
  },
};

const CasePage = Relay.createContainer(CasePageComponent, CasePageQuery);

export default CasePage;
