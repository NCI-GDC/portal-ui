// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, pure } from 'recompose';
import ArrangeIcon from 'react-icons/lib/fa/bars';

import { Row } from '@ncigdc/uikit/Flex';
import SortableItem from '@ncigdc/uikit/SortableItem';
import tableModels from '@ncigdc/tableModels';
import { toggleColumn, setColumns } from '@ncigdc/dux/tableColumns';
import styled from '@ncigdc/theme/styled';

const SortRow = styled(Row, {
  lineHeight: '1.5',
  alignItems: 'center',
  padding: '0.3rem 0.6rem',
  ':hover': {
    backgroundColor: ({ theme }) => theme.greyScale6,
  },
});

const ArrangeColumns = compose(
  connect((state, props) => ({
    tableColumns: state.tableColumns[props.entityType],
  })),
  withState('state', 'setState', ({ entityType }) => ({
    draggingIndex: null,
    columns: tableModels[entityType],
  })),
  pure,
)(({ dispatch, tableColumns, setState, state, searchTerm, entityType }) => {
  const filteredColumns = state.columns.filter(
    x =>
      x.name.toLowerCase().includes(searchTerm.toLowerCase()) && !x.subHeading,
  );

  return (
    <div>
      {filteredColumns.map((column, i) =>
        <SortableItem
          key={column.id}
          updateState={nextState =>
            setState(state => {
              if (!nextState.items && state.items) {
                const nextColumnIds = state.items.reduce(
                  (acc, x) => [
                    ...acc,
                    ...(tableColumns.includes(x.id)
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

                dispatch(setColumns({ entityType, ids: nextColumnIds }));
              }
              return { columns: filteredColumns, ...nextState };
            })}
          draggingIndex={state.draggingIndex}
          items={filteredColumns}
          sortId={i}
          outline="list"
        >
          <SortRow>
            <Row
              style={{ width: '100%', cursor: 'pointer' }}
              onClick={() => {
                if (column.subHeadingIds) {
                  column.subHeadingIds.forEach(id =>
                    dispatch(toggleColumn({ entityType, id })),
                  );
                }

                // brittle, assuming a single column with subheadings.
                const subHeadingCol = tableModels[entityType].find(
                  x => x.subHeadingIds,
                );
                // find current index of subheading columm
                const subHeadingColIndex = !subHeadingCol
                  ? -1
                  : tableColumns.indexOf(subHeadingCol.id);
                // figure out whether to put before or after column with subheadings
                const afterSubheadingCol =
                  subHeadingColIndex !== -1 && subHeadingColIndex < i;

                dispatch(
                  toggleColumn({
                    entityType,
                    id: column.id,
                    // if after subheading col include number of subheadings to place inbetween
                    index: afterSubheadingCol && !column.subHeadingIds
                      ? i + subHeadingCol.subHeadingIds.length
                      : i,
                  }),
                );
              }}
            >
              <input
                readOnly
                style={{ pointerEvents: 'none' }}
                type="checkbox"
                checked={tableColumns.includes(column.id)}
              />
              <span style={{ marginLeft: '0.3rem' }}>{column.name}</span>
            </Row>
            <ArrangeIcon style={{ marginLeft: 'auto', cursor: 'row-resize' }} />
          </SortRow>
        </SortableItem>,
      )}
    </div>
  );
});

export default ArrangeColumns;
