// @flow
import React from 'react';
import styled from '@ncigdc/theme/styled';

const TableRow = styled.tr({
  backgroundColor: ({ striped, theme }) =>
    striped ? theme.tableStripe : '#fff',
});

const Tr = ({ style = {}, children, index = 1, ...props }) => (
  <TableRow style={style} striped={index % 2 === 0} {...props}>
    {children}
  </TableRow>
);

export default Tr;
