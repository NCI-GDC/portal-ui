// @flow

import React from 'react';

import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import { get } from 'lodash';
import { commitMutation } from 'react-relay';
import environment from '@ncigdc/modern_components/environment';
import { setModal } from '@ncigdc/dux/modal';
import mutations from './mutations';

export default (Component: any) => {
  return compose(
    connect(),
    withState('isCreating', 'setIsCreating', false),
    withHandlers({
      createSet: ({ isCreating, setIsCreating, dispatch }) => ({
        onComplete,
        type,
        scope,
        action,
        forceCreate,
        size,
        sort,
        score,
        filters,
        set_id,
      }) => {
        const field = `${type}s.${type}_id`;
        const mutation = mutations[scope][type][action];

        const content = get(filters, 'content[0].content');

        const setOnlyInCurrentFilters = filters
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
          commitMutation(environment, {
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
              console.log(response);
              onComplete(
                get(response, ['sets', action, scope, type, 'set_id']),
                get(response, ['sets', action, scope, type, 'size']),
              );
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
