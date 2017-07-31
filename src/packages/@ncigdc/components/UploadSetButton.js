import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { setModal } from '@ncigdc/dux/modal';
import Dropdown from '@ncigdc/uikit/Dropdown';
import { CaretIcon } from '@ncigdc/theme/icons';
import { parseFilterParam } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Link from '@ncigdc/components/Links/Link';
import { getFilterValue } from '@ncigdc/utils/filters';

const enhance = compose(
  connect(({ sets }) => ({ sets })),
  withRouter,
  withProps(({ sets, type, query }) => {
    const currentFilters = parseFilterParam(query.filters, null);
    return {
      sets: sets[type] || {},
      currentFilters:
        currentFilters &&
          (Array.isArray(currentFilters.content)
            ? currentFilters
            : { op: 'and', content: [currentFilters] }),
    };
  }),
);

export default enhance(
  ({
    dispatch,
    UploadModal,
    children,
    defaultQuery,
    sets,
    query,
    push,
    idField,
    style,
    currentFilters,
  }) => {
    const currentValues = !currentFilters
      ? []
      : get(
          getFilterValue({
            currentFilters: currentFilters.content,
            dotField: idField,
          }),
          'content.value',
          [],
        ).filter(v => v.includes('set_id:'));

    return (
      <Row style={style}>
        <Button
          style={{
            padding: '4px 12px',
            width: '100%',
            borderRadius: '4px 0 0 4px',
          }}
          onClick={() => dispatch(setModal(<UploadModal />))}
        >
          {children}
        </Button>

        <Dropdown
          button={
            <Button
              disabled={!Object.keys(sets).length}
              style={{
                padding: '4px 12px',
                height: '100%',
                borderRadius: '0 4px 4px 0',
                borderLeft: '1px solid currentColor',
              }}
            >
              <CaretIcon direction="down" />
            </Button>
          }
        >

          {Object.entries(sets).map(([label, setId]: [string, string]) => {
            const value = `set_id:${setId}`;
            return (
              <DropdownItem key={label} style={{ padding: 5 }}>
                <Link
                  style={{ width: '100%' }}
                  merge="toggle"
                  {...defaultQuery}
                  query={{
                    ...defaultQuery.query,
                    filters: {
                      op: 'AND',
                      content: [
                        {
                          op: 'in',
                          content: { field: idField, value: [value] },
                        },
                      ],
                    },
                  }}
                >
                  <input
                    readOnly
                    style={{ pointerEvents: 'none' }}
                    type="checkbox"
                    checked={currentValues.includes(value)}
                    name={label}
                  />
                  <label htmlFor={label} style={{ marginLeft: '0.3rem' }}>
                    {label}
                  </label>
                </Link>

              </DropdownItem>
            );
          })}
        </Dropdown>
      </Row>
    );
  },
);
