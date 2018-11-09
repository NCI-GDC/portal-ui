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

const ArrangeColumns = compose(
  connect((state, props) => ({
    localTableColumns: state.tableColumns[props.entityType],
  })),
  withState('state', 'setState', props => ({
    draggingIndex: null,
    // localTableColumns: props.localTableColumns,
  })),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (nextProps.localTableColumns !== this.props.localTableColumns) {
        nextProps.setState({ localTableColumns: this.props.localTableColumns });
      }
    },
  }),
  pure
)(
  ({
    dispatch,
    localTableColumns,
    setState,
    state,
    searchTerm,
    entityType,
  }) => {
    return (
      <div className="test-arrange-columns">
        {localTableColumns.map((column, i) => (
          <SortableItem
            className="test-column"
            key={column.id}
            updateState={nextState => {
              if (!nextState.items && state.items) {
                dispatch(
                  setColumns({
                    entityType,
                    order: state.items,
                  })
                );
              }
              setState(state => ({ localTableColumns, ...nextState }));
            }}
            draggingIndex={state.draggingIndex}
            items={localTableColumns}
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
                    ? localTableColumns.ids.indexOf(subHeadingCol.id)
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
                  checked={!localTableColumns[i].hidden}
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
