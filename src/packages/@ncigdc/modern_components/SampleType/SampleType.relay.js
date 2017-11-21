import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';

import { makeFilter } from '@ncigdc/utils/filters';
import { withRouter } from 'react-router-dom';
import { BaseQuery } from '@ncigdc/modern_components/Query';

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
    withPropsOnChange(['entityType, entityId'], ({ entityType, entityId }) => {
      return {
        variables: {
          filters: makeFilter([
            {
              field: fieldMap[entityType],
              value: entityId,
            },
          ]),
        },
      };
    }),
  )((props: Object) => {
    return (
      <BaseQuery
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
