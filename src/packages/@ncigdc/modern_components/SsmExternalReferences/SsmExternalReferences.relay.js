import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import {
  branch,
  compose,
  renderComponent,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) => compose(
  setDisplayName('EnhancedSSMExternalReferences_Relay'),
  branch(
    ({ ssmId }) => !ssmId,
    renderComponent(() => (
      <div>
        <pre>ssmId</pre>
        {' '}
        must be provided
      </div>
    )),
  ),
  withPropsOnChange(['ssmId'], ({ ssmId }) => ({
    variables: {
      filters: makeFilter([
        {
          field: 'ssms.ssm_id',
          value: [ssmId],
        },
      ]),
      withDbsnp_rs: {
        content: [
          {
            content: {
              field: 'consequence.transcript.annotation.dbsnp_rs',
              value: 'MISSING',
            },
            op: 'NOT',
          },
        ],
        op: 'AND',
      },
    },
  })),
)((props: Object) => (
  <Query
    Component={Component}
    minHeight={200}
    parentProps={props}
    query={graphql`
      query SsmExternalReferences_relayQuery(
        $filters: FiltersArgument
        $withDbsnp_rs: FiltersArgument
      ) {
        viewer {
          explore {
            ssms {
              hits(first: 1, filters: $filters) {
                edges {
                  node {
                    clinical_annotations {
                      civic {
                        gene_id
                        variant_id
                      }
                    }
                    cosmic_id
                    consequence {
                      hits(first: 1, filters: $withDbsnp_rs) {
                        edges {
                          node {
                            transcript {
                              annotation {
                                dbsnp_rs
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
    variables={props.variables}
    />
));
