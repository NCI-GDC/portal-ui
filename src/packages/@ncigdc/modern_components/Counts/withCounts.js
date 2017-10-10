import React from 'react';
import { isEqual } from 'lodash';
import { compose, withProps, mapProps } from 'recompose';
import { get, flatten } from 'lodash';
import namespace, { parentKey } from 'namespace-hoc';

import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';

import exploreCase from './exploreCase.relay';
import repositoryCase from './repositoryCase.relay';
import exploreGene from './exploreGene.relay';
import exploreSsm from './exploreSsm.relay';

const typeMap = {
  explore: {
    case: exploreCase,
    gene: exploreGene,
    ssm: exploreSsm,
  },
  repository: {
    case: repositoryCase,
  },
};

const namespaceKey = '__internal_with_counts__';
export default (ns, getRequests) => Component => {
  return namespace(
    { namespace: namespaceKey },
    withProps(({ [parentKey]: parentProps }) => ({
      requests: getRequests(parentProps),
    })),
    withPropsOnChange(
      (props, nextProps) => !isEqual(props.requests, nextProps.requests),
      ({ requests }) => {
        return {
          Component: compose(
            ...flatten(
              Object.entries(
                requests,
              ).map(([key, { filters, scope, type }]) => [
                withProps(() => ({ filters, scope, type })),
                typeMap[scope][type],
                withProps(({ results, viewer, path }) => ({
                  results: Object.assign(requests.constructor(), results, {
                    [key]: get(viewer, path, ''),
                  }),
                })),
              ]),
            ),
            mapProps(({ results, origProps }) => ({
              ...origProps,
              [ns]: results,
            })),
          )(Component),
        };
      },
    ),
  )(({ [namespaceKey]: { Component }, ...props }) => (
    <Component origProps={props} />
  ));
};
