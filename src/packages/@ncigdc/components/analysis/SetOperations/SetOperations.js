import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import Venn from '@ncigdc/components/Charts/Venn';
import { Row, Column } from '@ncigdc/uikit/Flex';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import {
  ExploreCaseCount,
  GeneCount,
  SsmCount,
} from '@ncigdc/modern_components/Counts';
import withRouter from '@ncigdc/utils/withRouter';
import Measure from 'react-measure';

import OpsTable from './OpsTable';
import buildOps from './buildOps';
import TwoSetOverlay from './TwoSetOverlay';
import ThreeSetOverlay from './ThreeSetOverlay';

const countComponents = {
  case: ExploreCaseCount,
  gene: GeneCount,
  ssm: SsmCount,
};

const colors = [
  'rgb(237, 237, 237)',
  'rgb(195, 232, 244)',
  'rgb(165, 218, 235)',
];

const Alias = ({ i }) => <span><em>S</em><sub>{i}</sub></span>;

export default compose(
  connect(s => ({ sets: s.sets })),
  withState('selected', 'setSelected', new Set()),
  withState('hovering', 'setHovering', new Set()),
  withRouter,
)(
  ({
    setIds,
    sets,
    type,
    selected,
    setSelected,
    push,
    hovering,
    setHovering,
    dispatch,
  }) => {
    const setData = Object.entries(sets[type]).filter(([setId]) =>
      setIds.map(x => x.split(':')[1]).includes(setId),
    );

    const toggle = op => {
      selected[selected.has(op) ? 'delete' : 'add'](op);
      setSelected(selected);
    };

    const CountComponent = countComponents[type];

    const ops = buildOps({ setData, type });

    const selectedFilters = {
      op: 'or',
      content: ops.filter(d => selected.has(d.op)).map(op => op.filters),
    };

    return (
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 20 }}>Set Operations</div>
        <div>
          Click on the areas of the Venn diagram to include them in your
          result set.
        </div>
        <Column style={{ marginTop: 10 }}>
          <Row>
            <Measure key="bar-chart">
              {({ width }) =>
                <div style={{ position: 'relative', width: '40%' }}>
                  <div style={{ position: 'absolute' }}>
                    <Venn
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
                  {ops.length === 3
                    ? <TwoSetOverlay
                        width={width}
                        ops={ops}
                        CountComponent={CountComponent}
                      />
                    : <ThreeSetOverlay
                        width={width}
                        ops={ops}
                        CountComponent={CountComponent}
                      />}
                </div>}
            </Measure>
            <Column style={{ width: '60%' }}>
              <EntityPageHorizontalTable
                data={setData.map(([setId, label], i) => {
                  const id = `set-table-${type}-${setId}-select`;
                  return {
                    id,
                    alias: <Alias i={i + 1} />,
                    name: (
                      <label htmlFor={id}>
                        {_.truncate(label, { length: 70 })}
                      </label>
                    ),
                    type,
                    count: (
                      <CountComponent
                        filters={{
                          op: '=',
                          content: {
                            field: `${type}s.${type}_id`,
                            value: `set_id:${setId}`,
                          },
                        }}
                      />
                    ),
                  };
                })}
                headings={[
                  { key: 'alias', title: 'Alias' },
                  { key: 'name', title: 'Name', style: { width: 100 } },
                  {
                    key: 'count',
                    title: '# Items',
                    style: { textAlign: 'right' },
                  },
                  { key: 'type', title: 'Item Type' },
                ]}
              />
              <hr />
              <OpsTable
                type={type}
                selected={selected}
                toggle={toggle}
                push={push}
                ops={ops}
                dispatch={dispatch}
                CountComponent={CountComponent}
                selectedFilters={selectedFilters}
              />
            </Column>
          </Row>
        </Column>
      </div>
    );
  },
);
