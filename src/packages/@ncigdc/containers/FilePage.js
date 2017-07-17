/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';

import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import File from '@ncigdc/components/File';

export type TProps = {
  node: {
    access: string,
    cases: Array<{
      project: {
        project_id: string,
      },
    }>,
    data_category: string,
    data_format: string,
    file_id: string,
    file_name: string,
    file_size: number,
    platform: string,
  },
};

export const FilePageComponent = (props: TProps) =>
  <FullWidthLayout
    title={props.node.file_name}
    entityType="FL"
    data-test="file-page"
  >
    <File node={props.node} />
  </FullWidthLayout>;

export const FilePageQuery = {
  fragments: {
    node: () => Relay.QL`
      fragment on File {
        file_id
        submitter_id
        file_id
        file_name
        file_size
        access
        data_category
        data_format
        data_type
        experimental_strategy
        md5sum
        state
        file_state
        acl
        analysis {
          analysis_id
          workflow_type
          updated_datetime
          input_files {
            hits(first: 1) {
              total
              edges {
                node {
                  file_id
                }
              }
            }
          }
          metadata {
            read_groups {
              hits(first: 99) {
                edges {
                  node {
                    read_group_id
                    is_paired_end
                    read_length
                    library_name
                    sequencing_center
                    sequencing_date
                  }
                }
              }
            }
          }
        }
        downstream_analyses {
          hits(first: 99) {
            edges {
              node {
                workflow_type
                output_files {
                  hits(first: 99) {
                    edges {
                      node {
                        file_id
                        access
                        file_name
                        data_category
                        data_type
                        data_format
                        file_size
                      }
                    }
                  }
                }
              }
            }
          }
        }
        annotations {
          hits(first:99) {
            edges {
              node {
                annotation_id
                entity_id
              }
            }
          }
        }
        cases {
          hits(first:99) {
            edges {
              node {
                project {
                  project_id
                }
              }
            }
          }
        }
        associated_entities {
          hits(first:99) {
            edges {
              node {
                case_id
                entity_id
                entity_submitter_id
                entity_type
              }
            }
          }
        }
        metadata_files {
          hits(first:99) {
            edges {
              node {
                file_id
                access
                file_name
                data_category
                data_type
                data_format
                file_size
              }
            }
          }
        }
        archive {
          archive_id
          submitter_id
          revision
        }
        platform
        index_files {
          hits {
            total
          }
        }
      }
    `,
  },
};

const FilePage = Relay.createContainer(FilePageComponent, FilePageQuery);

export default FilePage;
