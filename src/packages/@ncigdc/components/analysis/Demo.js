import React from 'react';
import countComponents from '@ncigdc/modern_components/Counts';
import withSetAction from '@ncigdc/modern_components/withSetAction';
import Loader from '@ncigdc/uikit/Loaders/Loader';

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setStates: Object.entries(props.sets).reduce((acc, [type, sets]) => {
        return Object.keys(sets).reduce((acc, id) => {
          acc.push({
            id,
            type,
            count: null,
            created: false,
          });
          return acc;
        }, acc);
      }, []),
    };
  }

  componentWillUpdate(nextProps, nextState) {
    nextState.setStates.forEach(({ count, id, type }, i) => {
      if (
        nextProps.filters &&
        count === 0 &&
        this.state.setStates[i].count !== 0
      ) {
        const {
          score,
          size,
          ...filters
        } = nextProps.filters[id];

        nextProps.createSet({
          action: 'create',
          filters,
          onComplete: () => {
            const setStates = [...this.state.setStates];
            setStates[i] = {
              ...setStates[i],
              created: true,
            };
            this.setState({ setStates });
          },
          scope: 'explore',
          set_id: id,
          size: size || 10000,
          type,
          ...score && { score },
        });
      }
    });
  }

  render() {
    const { children } = this.props;
    const setsReady = this.state.setStates.every(
      state => state.count > 0 || state.created,
    );
    return setsReady ? (
      <div>{children}</div>
    ) : (
      <Loader>
        {this.state.setStates.map(({ count, id, type }, i) => {
          const CountComponent = countComponents[type];

          return (
            <CountComponent
              filters={{
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
              }}
              handleCountChange={count => {
                const setStates = [...this.state.setStates];
                setStates[i] = {
                  ...setStates[i],
                  count,
                };
                this.setState({ setStates });
              }}
              key={id}
              >
              {() => null}
            </CountComponent>
          );
        })}
      </Loader>
    );
  }
}

export default withSetAction(Demo);
