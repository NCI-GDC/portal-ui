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

function updateColumns({ tableColumns, entityType }) {
  return tableColumns;
  // const columns = (tableColumns || []).map(c => Object.keys(c)[0]);
  // return tableModels[entityType]
  //   .slice()
  //   .sort((a, b) => columns.indexOf(a.id) - columns.indexOf(b.id));
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
  pure
)(({ dispatch, tableColumns, setState, state, searchTerm, entityType }) => {
  console.log('state', state.items, tableColumns);

  return (
    <div className="test-arrange-columns">
      {tableColumns.map((column, i) => (
        <SortableItem
          className="test-column"
          key={column.id}
          updateState={nextState =>
            setState(state => {
              if (!nextState.items && state.items) {
                dispatch(
                  setColumns({
                    entityType,
                    order: state.items,
                  })
                );
              }
              console.log('orderColumns', nextState.items);
              return { tableColumns, ...nextState };
            })}
          draggingIndex={state.draggingIndex}
          items={tableColumns}
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
                    dispatch(toggleColumn({ entityType, id, i }))
                  );
                }

                // brittle, assuming a single column with subheadings.
                const subHeadingCol = tableModels[entityType].find(
                  x => x.subHeadingIds
                );
                // find current index of subheading columm
                const subHeadingColIndex = subHeadingCol
                  ? tableColumns.ids.indexOf(subHeadingCol.id)
                  : -1;
                // figure out whether to put before or after column with subheadings
                const afterSubheadingCol =
                  subHeadingColIndex !== -1 && subHeadingColIndex < i;
                dispatch(
                  toggleColumn({
                    entityType,
                    id: column.id,
                    index: i,
                    // if after subheading col include number of subheadings to place inbetween
                  })
                );
              }}
            >
              <input
                readOnly
                style={{ pointerEvents: 'none' }}
                aria-label={column.name}
                type="checkbox"
                checked={!tableColumns[i].hidden}
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
