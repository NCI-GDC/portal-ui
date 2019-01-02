import React from 'react';
import { compose, withState, withPropsOnChange } from 'recompose';

import Venn, { buildOps } from '@ncigdc/components/Charts/Venn';
import { Row } from '@ncigdc/uikit/Flex';
import countComponents from '@ncigdc/modern_components/Counts';
import withRouter from '@ncigdc/utils/withRouter';
import { CreateExploreCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import { CreateExploreGeneSetButton } from '@ncigdc/modern_components/withSetAction';
import { CreateExploreSsmSetButton } from '@ncigdc/modern_components/withSetAction';
import OpsTable from './OpsTable';
import SetTable from './SetTable';

const CreateSetButtonMap = {
  case: CreateExploreCaseSetButton,
  ssm: CreateExploreSsmSetButton,
  gene: CreateExploreGeneSetButton,
};

const colors = [
  'rgb(237, 237, 237)',
  'rgb(195, 232, 244)',
  'rgb(165, 218, 235)',
];

export default compose(
  withState('selected', 'setSelected', () => new Set()),
  withState('hovering', 'setHovering', () => new Set()),
  withRouter,
  withState('setSizes', 'setSetSizes', {}),
  withPropsOnChange(
    ['setSizes'],
    ({ message, setSizes, sets, deprecatedSets }) => {
      return {
        deprecatedSets: Object.entries(setSizes)
          .filter(([id, size]) => size === 0)
          .map(([setId]) => sets[setId]),
      };
    },
  ),
)(
  ({
    sets,
    type,
    selected,
    setSelected,
    push,
    hovering,
    setHovering,
    CreateSetButton = CreateSetButtonMap[type],
    message,
    setSizes,
    setSetSizes,
    deprecatedSets,
  }) => {
    const toggle = op => {
      selected[selected.has(op) ? 'delete' : 'add'](op);
      setSelected(selected);
    };
    const CountComponent = countComponents[type];
    const ops = buildOps({ setIds: Object.keys(sets), type });

    const selectedFilters = {
      op: 'or',
      content: ops.filter(d => selected.has(d.op)).map(op => op.filters),
    };

    return (
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 20 }}>Set Operations</div>
        {deprecatedSets.length > 0 &&
          `Analysis is deprecated because it contains one or more deprecated sets (${deprecatedSets.join(
            ', ',
          )})`}
        {message && <div style={{ fontStyle: 'italic' }}>{message}</div>}
        <div
          style={{
            display: deprecatedSets.length ? 'none' : 'auto',
          }}
        >
          <div>
            Click on the areas of the Venn diagram to include them in your
            result set.
          </div>

          <Row
            style={{
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <Venn
              style={{ width: '30%', maxWidth: 300, margin: '0 5%' }}
              type={type}
              ops={ops}
              onClick={toggle}
              onMouseOver={op => {
                hovering.add(op);
                setHovering(hovering);
              }}
              onMouseOut={() => setHovering(new Set())}
              getFillColor={(d, i) => {
                return hovering.has(d.op)
                  ? colors[1]
                  : selected.has(d.op) ? colors[2] : colors[0];
              }}
            />
            <div style={{ flexGrow: 1 }}>
              <SetTable
                push={push}
                sets={sets}
                type={type}
                CountComponent={CountComponent}
                CreateSetButton={CreateSetButton}
                setSetSize={({ setId, size }) =>
                  setSetSizes({ ...setSizes, [setId]: size })}
              />
              <hr />
              {OpsTable({
                type,
                selected,
                toggle,
                push,
                ops,
                CountComponent,
                selectedFilters,
                CreateSetButton,
              })}
            </div>
          </Row>
        </div>
      </div>
    );
  },
);
