// import Relay from 'react-relay/classic';
import React from 'react';
import { graphql } from 'react-relay';
import { BaseQuery } from '@ncigdc/modern_components/Query';
import { compose, setDisplayName } from 'recompose';


const EnhancedSummaryPageQuery = (Component) => compose(
  setDisplayName('SummaryPageQuery')
)(
  (props) => (
    <BaseQuery
      Component={Component}
      parentProps={props}
      query={graphql`
        query SummaryPage_relayQuery($filters: FiltersArgument) {
          viewer {
            explore {
              cases {
                aggregations(filters: $filters){
                  samples__sample_type{
                    buckets{
                      doc_count
                      key
                    }
                  }
                  summary__experimental_strategies__experimental_strategy{
                    buckets{
                      doc_count
                      key
                    }
                  }
                  diagnoses__age_at_diagnosis{
                    histogram {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                  demographic__vital_status {
                    buckets{
                      doc_count
                      key
                    }
                  }
                  demographic__race {
                    buckets{
                      doc_count
                      key
                    }
                  }
                  demographic__gender {
                    buckets{
                      doc_count
                      key
                    }
                  }
                }
              }
            }
          }
        }
      `}
      variables={{ filters: props.filters }}
      />
  )
);

export default EnhancedSummaryPageQuery;
