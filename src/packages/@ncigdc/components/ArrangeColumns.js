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

const ArrangeColumns = compose(
  connect((state, props) => ({
    localTableColumns: state.tableColumns[props.entityType],
    filteredTableColumns: state.tableColumns[props.entityType].filter(
      t => !t.subHeading
    ),
  })),
  withState('state', 'setState', props => ({
    draggingIndex: null,
    // localTableColumns: props.localTableColumns,
  })),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (nextProps.localTableColumns !== this.props.localTableColumns) {
        nextProps.setState({
          filteredTableColumns: this.props.localTableColumns.filter(
            t => !t.subHeading
          ),
        });
      }
    },
  }),
  pure
)(
  ({
    dispatch,
    localTableColumns,
    filteredTableColumns,
    setState,
    state,
    searchTerm,
    entityType,
  }) => {
    const subHeadings = localTableColumns.filter(t => t.subHeading) || [];
    return (
      <div className="test-arrange-columns">
        {filteredTableColumns.map((column, i) => (
          <SortableItem
            className="test-column"
            key={column.id}
            updateState={nextState => {
              if (!nextState.items && state.items) {
                let newItems = state.items.filter(item => !item.subHeading);
                if (subHeadings && subHeadings.length > 0) {
                  const index = filteredTableColumns.indexOf(
                    filteredTableColumns.find(t => t.subHeadingIds)
                  );
                  console.log('items', newItems, index);
                  newItems = newItems
                    .slice(0, index)
                    .concat(subHeadings)
                    .concat(newItems.slice(index));
                }
                console.log('newItems', newItems);
                dispatch(
                  setColumns({
                    entityType,
                    order: newItems,
                  })
                );
              }
              setState(s => ({ filteredTableColumns, ...nextState }));
            }}
            draggingIndex={state.draggingIndex}
            items={filteredTableColumns}
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
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  alignItems: 'center',
                }}
                onClick={() => {
                  if (column.subHeadingIds) {
                    localTableColumns.forEach((col, j) => {
                      if (col.subHeading) {
                        const index = localTableColumns.indexOf(col);
                        dispatch(toggleColumn({ entityType, index }));
                      }
                    });
                  }

                  dispatch(
                    toggleColumn({
                      entityType,
                      index: localTableColumns.indexOf(column),
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
                  checked={!filteredTableColumns[i].hidden}
                />
                <span style={{ marginLeft: '0.3rem' }}>{column.name}</span>
              </Row>
              <ArrangeIcon
                style={{ marginLeft: 'auto', cursor: 'row-resize' }}
              />
            </SortRow>
          </SortableItem>
        ))}
      </div>
    );
  }
);

export default ArrangeColumns;
