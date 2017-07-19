import React from 'react';
import Showing from '@ncigdc/components/Pagination/Showing';
import Pagination from '@ncigdc/components/Pagination';
import withRouter from '@ncigdc/utils/withRouter';
import { compose } from 'recompose';
import { Row } from '../uikit/Flex/index';

const enhance = compose(withRouter);
const LocalPaginationTable = ({
  children,
  prefix,
  query,
  data,
  buttons,
  style,
  entityName = 'projects',
  sizes,
  ...props
}) => {
  const defaultSize = (sizes && sizes[0]) || 10;
  const size = parseInt(query[`${prefix}_size`] || defaultSize, 10);
  const offset = parseInt(query[`${prefix}_offset`] || 0, 10);
  const enablePagination = data.length > defaultSize;
  const params = {
    ...query,
    [`${prefix}_size`]: size,
    [`${prefix}_offset`]: enablePagination ? offset : 0,
  };
  const tableData = enablePagination ? data.slice(offset, offset + size) : data;

  return (
    <div style={style} className={props.className}>
      <Row
        style={{
          backgroundColor: 'white',
          padding: '1rem',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        {enablePagination
          ? <Showing
              docType={entityName}
              prefix={prefix}
              params={params}
              total={data.length}
            />
          : <span />}
        {buttons}
      </Row>
      {React.Children.map(children, child =>
        React.cloneElement(child, { data: tableData }),
      )}
      {enablePagination &&
        <Pagination
          prefix={prefix}
          params={params}
          total={data.length}
          sizes={sizes}
        />}
    </div>
  );
};

export default enhance(LocalPaginationTable);
