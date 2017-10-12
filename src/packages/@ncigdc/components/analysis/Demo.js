import React from 'react';
import { compose, withState } from 'recompose';

import withSetAction from '@ncigdc/modern_components/withSetAction';
import Loader from '@ncigdc/uikit/Loaders/Loader';
import { withCounts } from '@ncigdc/modern_components/Counts';
import { MAX_SET_SIZE } from '@ncigdc/utils/constants';

const enhance = compose(
  withState('setStates', 'setSetStates', props =>
    Object.entries(props.sets).reduce((acc, [type, sets]) => {
      return Object.keys(sets).reduce((acc, id) => {
        acc.push({ id, type, created: false });
        return acc;
      }, acc);
    }, []),
  ),
  withCounts('counts', ({ setStates }) =>
    setStates.map(({ id, type }) => {
      return {
        type,
        scope: 'explore',
        filters: {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: `${type}s.${type}_id`,
                value: [`set_id:${id}`],
              },
            },
          ],
        },
      };
    }),
  ),
  withSetAction,
);

class Demo extends React.Component {
  componentWillReceiveProps(nextProps) {
    nextProps.setStates.forEach(({ id, type }, i) => {
      if (nextProps.counts[i] === 0 && this.props.counts[i] !== 0) {
        nextProps.createSet({
          type,
          scope: 'explore',
          action: 'create',
          size: MAX_SET_SIZE,
          set_id: id,
          filters: nextProps.filters[id],
          onComplete: () => {
            nextProps.setSetStates(state => {
              const setStates = [...state];
              setStates[i] = { ...setStates[i], created: true };
              return setStates;
            });
          },
        });
      }
    });
  }
  render() {
    const { children, setStates, counts } = this.props;
    const setsReady = setStates.every(
      (state, i) => counts[i] > 0 || state.created,
    );
    return setsReady ? <div>{children}</div> : <Loader />;
  }
}

export default enhance(Demo);
