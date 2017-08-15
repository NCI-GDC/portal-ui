import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const enhance = compose(connect(state => ({ sets: state.sets })));

export default enhance(({ set, sets }) => {
  const setId = set.replace('set_id:', '');

  return (
    <span>
      {Object.values(sets).reduce((setLabel, obj) => {
        return Object.entries(obj).reduce((setLabel, [id, label]) => {
          return setId === id ? label : setLabel;
        }, setLabel);
      }, 'input set')}
    </span>
  );
});
