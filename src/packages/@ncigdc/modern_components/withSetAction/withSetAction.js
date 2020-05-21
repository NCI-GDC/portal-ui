// @flow

import React from 'react';

import { connect } from 'react-redux';
import { withControlledAccessNetworkLayer } from '@ncigdc/utils/withControlledAccess';
import { compose, withState, withHandlers } from 'recompose';
import { get } from 'lodash';
import { commitMutation } from 'react-relay';
import environment from '@ncigdc/modern_components/environment';
import { setModal } from '@ncigdc/dux/modal';
import mutations from './mutations';

export default (Component: any) => {
  return compose(
    connect(),
    withControlledAccessNetworkLayer,
    withState('isCreating', 'setIsCreating', false),
    withHandlers({
      createSet: ({
        addControlledAccessParams = () => ({}),
        dispatch,
        isCreating,
        setIsCreating,
      }) => ({
        action,
        filters,
        forceCreate,
        onComplete,
        scope,
        score,
        set_id,
        size,
        sort,
        type,
      }) => {
        const field = `${type}s.${type}_id`;
        const mutation = mutations[scope][type][action];

        const content = get(filters, 'content[0].content');
        const setOnlyInCurrentFilters =
          filters && Object.keys(filters).length !== 0
            ? filters.content.length === 1 &&
              ['in', '='].includes(filters.content[0].op.toLowerCase()) &&
              content.value &&
              content.value.length === 1 &&
              content.value[0].toString().includes('set_id:') &&
              content.field === field
            : false;

        if (
          !forceCreate &&
          (setOnlyInCurrentFilters &&
            (!set_id || set_id === get(content, 'value[0]', '')))
        ) {
          const setId = get(content, 'value[0]', '').substring(
            'set_id:'.length,
          );
          onComplete(setId);
        } else {
          setIsCreating(true);
          commitMutation(environment(addControlledAccessParams), {
            mutation,
            variables: {
              input: {
                set_id,
                filters: filters || {},
                size,
                sort,
                score,
              },
            },
            onCompleted: response => {
              setIsCreating(false);
              const hash = get(response, [
                'sets',
                action,
                scope,
                type,
              ]);
              const [setId, size] = [hash.set_id, hash.size];
              onComplete(setId, size);
            },
            onError: err => {
              setIsCreating(false);
              dispatch(
                setModal(
                  <div style={{ padding: '15px' }}>
                    <h3>Error creating set</h3>
                    {`${err}`}
                  </div>,
                ),
              );
            },
          });
        }
      },
    }),
  )(Component);
};
