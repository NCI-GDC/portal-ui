// @flow

import React from 'react';
import { graphql } from 'react-relay';
import Query from '@ncigdc/modern_components/Query';
import { Row, Column } from '@ncigdc/uikit/Flex';
import styled from '@ncigdc/theme/styled';

const CenteredColumnContainer = styled(Column, {
  flex: 1,
  padding: '3rem',
  height: '50rem',
  position: 'absolute !important',
  alignItems: 'center',
  justifyContent: 'center',
  top: 0,
  width: '100%',
});

export default (Component: ReactClass<*>) => (props: Object) => {
  return (
    <Query
      Component={Component}
      Loader={({ loading }) => (!loading ? null : (
        <CenteredColumnContainer>
          <Row
            style={{
              color: 'white',
              fontSize: '1.2em',
              marginBottom: '1rem',
            }}>
              Loading, please wait...
          </Row>
          <span
            className="fa fa-spinner fa-spin fa-2x"
            style={{ color: 'white' }} />
        </CenteredColumnContainer>
        ))}
      minHeight={200}
      parentProps={props}
      query={graphql`
        query HumanBody_relayQuery {
          viewer {
            repository {
              files {
                aggregations {
                  cases__primary_site {
                    buckets {
                      doc_count
                      key
                    }
                  }
                }
              }
              cases {
                aggregations {
                  primary_site {
                    buckets {
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
      variables={props.variables} />
  );
};
