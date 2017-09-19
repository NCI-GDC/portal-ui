import React from 'react';

import countComponents from '@ncigdc/modern_components/Counts/index';
import CreateExploreCaseSetButton from '@ncigdc/modern_components/setButtons/CreateExploreCaseSetButton';
import CreateExploreGeneSetButton from '@ncigdc/modern_components/setButtons/CreateExploreGeneSetButton';
import CreateExploreSsmSetButton from '@ncigdc/modern_components/setButtons/CreateExploreSsmSetButton';

const CREATE = {
  case: CreateExploreCaseSetButton,
  gene: CreateExploreGeneSetButton,
  ssm: CreateExploreSsmSetButton,
};

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      states: Object.entries(props.sets).reduce((acc, [type, sets]) => {
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
  render() {
    const { filters, children } = this.props;
    return this.state.states.every(
      state => state.count > 0 || state.created,
    ) ? (
      <div>{children}</div>
    ) : (
      <div>
        {this.state.states.map(({ count, id, type }, i) => {
          const CountComponent = countComponents[type];
          const CreateComponent = CREATE[type];

          return (
            <div key={id}>
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
                  const states = [...this.state.states];
                  states[i] = { ...states[i], count };
                  this.setState({ states });
                }}
              >
                {() => {}}
              </CountComponent>

              {count === 0 && (
                <CreateComponent
                  style={{ display: 'none' }}
                  size={10000}
                  shouldCallCreateSet
                  set_id={id}
                  filters={filters[id]}
                  onComplete={() => {
                    const states = [...this.state.states];
                    states[i] = { ...states[i], created: true };
                    this.setState({ states });
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Demo;
