import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, pure, lifecycle } from 'recompose';
import ArrangeIcon from 'react-icons/lib/fa/bars';
import { IThemeProps } from '@ncigdc/theme/versions/active';
import { Row } from '@ncigdc/uikit/Flex';
import SortableItem from '@ncigdc/uikit/SortableItem';
// import tableModels from '@ncigdc/tableModels';
import {
  toggleColumn,
  setColumns,
  ITableColumnsAction,
} from '@ncigdc/dux/tableColumns';
import styled from '@ncigdc/theme/styled';

const SortRow = styled(Row, {
  alignItems: 'center',
  padding: '0.3rem 0.6rem',
  ':hover': {
    backgroundColor: (theme: IThemeProps): string => {
      return theme.greyScale6;
    },
  },
});
interface IArrangeColumnsProps {
  dispatch: (action: ITableColumnsAction) => void;
  localTableColumns: { [x: string]: any };
  filteredTableColumns: { [x: string]: any };
  setState: (props: { [x: string]: any }) => any;
  state: { [x: string]: any };
  searchTerm: string;
  entityType: string;
}
const ArrangeColumns = compose<IArrangeColumnsProps, JSX.Element>(
  connect((state: { [x: string]: any }, props: { [x: string]: any }) => ({
    localTableColumns: state.tableColumns[props.entityType],
    filteredTableColumns: state.tableColumns[props.entityType].filter(
      (t: any) => !t.subHeading
    ),
  })),
  withState('state', 'setState', props => ({
    draggingIndex: null,
    // localTableColumns: props.localTableColumns,
  })),
  lifecycle({
    componentWillReceiveProps(nextProps: { [x: string]: any }) {
      if (nextProps.localTableColumns !== this.props.localTableColumns) {
        nextProps.setState({
          filteredTableColumns: this.props.localTableColumns.filter(
            (t: any) => !t.subHeading
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
    const subHeadings =
      localTableColumns.filter((t: any) => t.subHeading) || [];
    return (
      <div className="test-arrange-columns">
        {filteredTableColumns.map((column: any, i: number) => (
          <SortableItem
            className="test-column"
            key={column.id}
            updateState={(nextState: any) => {
              if (!nextState.items && state.items) {
                let newItems: any = state.items.filter(
                  (item: any) => !item.subHeading
                );
                if (subHeadings && subHeadings.length > 0) {
                  const index: number = filteredTableColumns.indexOf(
                    filteredTableColumns.find((t: any) => t.subHeadingIds)
                  );
                  newItems = newItems
                    .slice(0, index)
                    .concat(subHeadings)
                    .concat(newItems.slice(index));
                }
                dispatch(
                  setColumns({
                    entityType,
                    order: newItems,
                  })
                );
              }
              setState((s: any) => ({ filteredTableColumns, ...nextState }));
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
                    localTableColumns.forEach((col: any, j: number) => {
                      if (col.subHeading) {
                        const index: string = localTableColumns.indexOf(col);
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
