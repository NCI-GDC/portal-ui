import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import Query from '@ncigdc/modern_components/Query';
import { makeFilter } from '@ncigdc/utils/filters';
import { withRouter } from 'react-router-dom';

const fieldMap = {
  sample: 'cases.samples.sample_id',
  portion: 'cases.samples.portions.portion_id',
  analyte: 'cases.samples.portions.analytes.analyte_id',
  aliquot: 'cases.samples.portions.analytes.aliquots.aliquot_id',
  slide: 'cases.samples.portions.slides.slide_id',
};

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(['ae'], ({ ae }) => {
      console.log(ae, fieldMap[ae.entity_type]);
      return {
        variables: {
          filters: makeFilter([
            {
              field: fieldMap[ae.entity_type],
              value: ae.entity_id,
            },
          ]),
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        name="SampleType"
        parentProps={props}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query SampleType_relayQuery($filters: FiltersArgument) {
            repository {
              cases {
                hits(first: 1, filters: $filters) {
                  edges {
                    node {
                      samples {
                        hits(first: 1, filters: $filters) {
                          edges {
                            node {
                              sample_type
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
