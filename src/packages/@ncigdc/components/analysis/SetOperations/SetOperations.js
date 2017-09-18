import React from 'react';
import { compose, withState } from 'recompose';

import Venn, { buildOps } from '@ncigdc/components/Charts/Venn';
import { Row, Column } from '@ncigdc/uikit/Flex';
import {
  ExploreCaseCount,
  GeneCount,
  SsmCount,
} from '@ncigdc/modern_components/Counts';
import withRouter from '@ncigdc/utils/withRouter';
import { WithSize } from '@ncigdc/utils/withSize';
import CreateExploreCaseSetButton from '@ncigdc/modern_components/setButtons/CreateExploreCaseSetButton';
import CreateExploreGeneSetButton from '@ncigdc/modern_components/setButtons/CreateExploreGeneSetButton';
import CreateExploreSsmSetButton from '@ncigdc/modern_components/setButtons/CreateExploreSsmSetButton';
import OpsTable from './OpsTable';
import SetTable from './SetTable';

const countComponents = {
  case: ExploreCaseCount,
  gene: GeneCount,
  ssm: SsmCount,
};

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
)(
  ({
    setIds,
    type,
    selected,
    setSelected,
    push,
    hovering,
    setHovering,
    dispatch,
    CreateSetButton = CreateSetButtonMap[type],
  }) => {
    const toggle = op => {
      selected[selected.has(op) ? 'delete' : 'add'](op);
      setSelected(selected);
    };

    const CountComponent = countComponents[type];

    const ops = buildOps({ setIds, type });

    const selectedFilters = {
      op: 'or',
      content: ops.filter(d => selected.has(d.op)).map(op => op.filters),
    };

    return (
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 20 }}>Set Operations</div>
        <div>
          Click on the areas of the Venn diagram to include them in your result
          set.
        </div>
        <Column style={{ marginTop: 10 }}>
          <Row>
            <WithSize>
              {({ width }) => (
                <div style={{ position: 'relative', width: '40%' }}>
                  <div style={{ position: 'absolute' }}>
                    <Venn
                      type={type}
                      width={width}
                      data={setIds}
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
                  </div>
                </div>
              )}
            </WithSize>
            <Column style={{ width: '60%' }}>
              <SetTable
                push={push}
                setIds={setIds}
                type={type}
                CountComponent={CountComponent}
                CreateSetButton={CreateSetButton}
              />
              <hr />
              {OpsTable({
                type,
                selected,
                toggle,
                push,
                ops,
                dispatch,
                CountComponent,
                selectedFilters,
                CreateSetButton,
              })}
            </Column>
          </Row>
        </Column>
      </div>
    );
  },
);
