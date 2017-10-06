// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, pure, lifecycle } from 'recompose';
import ArrangeIcon from 'react-icons/lib/fa/bars';

import { Row } from '@ncigdc/uikit/Flex';
import SortableItem from '@ncigdc/uikit/SortableItem';
import tableModels from '@ncigdc/tableModels';
import { toggleColumn, setColumns } from '@ncigdc/dux/tableColumns';
import styled from '@ncigdc/theme/styled';

const SortRow = styled(Row, {
  alignItems: 'center',
  padding: '0.3rem 0.6rem',
  ':hover': {
    backgroundColor: ({ theme }) => theme.greyScale6,
  },
});

function updateColumns({ tableColumns: { order }, entityType }) {
  return tableModels[entityType]
    .slice()
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}

const ArrangeColumns = compose(
  connect((state, props) => ({
    tableColumns: state.tableColumns[props.entityType],
  })),
  withState('state', 'setState', props => ({
    draggingIndex: null,
    columns: updateColumns(props),
  })),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (nextProps.tableColumns !== this.props.tableColumns) {
        nextProps.setState({ columns: updateColumns(nextProps) });
      }
    },
  }),
  pure,
)(({ dispatch, tableColumns, setState, state, searchTerm, entityType }) => {
  const columns = state.columns.filter(column => !column.subHeading);
  return (
    <div className="test-arrange-columns">
      {columns.map((column, i) => (
        <SortableItem
          className="test-column"
          key={column.id}
          updateState={nextState =>
            setState(state => {
              if (!nextState.items && state.items) {
                const nextColumnIds = state.items.reduce(
                  (acc, x) => [
                    ...acc,
                    ...(tableColumns.ids.includes(x.id)
                      ? [
                          x.id,
                          ...tableModels[entityType]
                            .filter(c => c.parent === x.id)
                            .map(c => c.id),
                        ]
                      : []),
                  ],
                  [],
                );
                dispatch(
                  setColumns({
                    entityType,
                    ids: nextColumnIds,
                    order: state.items.map(c => c.id),
                  }),
                );
              }
              return { columns, ...nextState };
            })}
          draggingIndex={state.draggingIndex}
          items={columns}
          sortId={i}
          outline="list"
        >
          <SortRow
            style={
              column.name.toLowerCase().includes(searchTerm.toLowerCase())
                ? {}
                : { display: 'none' }
            }
          >
            <Row
              style={{ width: '100%', cursor: 'pointer', alignItems: 'center' }}
              onClick={() => {
                if (column.subHeadingIds) {
                  column.subHeadingIds.forEach((id, j) =>
                    dispatch(toggleColumn({ entityType, id, index: i + j })),
                  );
                }

                // brittle, assuming a single column with subheadings.
                const subHeadingCol = tableModels[entityType].find(
                  x => x.subHeadingIds,
                );
                // find current index of subheading columm
                const subHeadingColIndex = !subHeadingCol
                  ? -1
                  : tableColumns.ids.indexOf(subHeadingCol.id);
                // figure out whether to put before or after column with subheadings
                const afterSubheadingCol =
                  subHeadingColIndex !== -1 && subHeadingColIndex < i;

                dispatch(
                  toggleColumn({
                    entityType,
                    id: column.id,
                    // if after subheading col include number of subheadings to place inbetween
                    index:
                      afterSubheadingCol && !column.subHeadingIds
                        ? i + subHeadingCol.subHeadingIds.length
                        : i,
                  }),
                );
              }}
            >
              <input
                readOnly
                style={{ pointerEvents: 'none' }}
                aria-label={column.name}
                type="checkbox"
                checked={tableColumns.ids.includes(column.id)}
              />
              <span style={{ marginLeft: '0.3rem' }}>{column.name}</span>
            </Row>
            <ArrangeIcon style={{ marginLeft: 'auto', cursor: 'row-resize' }} />
          </SortRow>
        </SortableItem>
      ))}
    </div>
  );
});

export default ArrangeColumns;
