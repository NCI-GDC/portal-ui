// Vendor
import React, { PropTypes } from 'react';

// Custom
import Tr from './Tr';

/*----------------------------------------------------------------------------*/

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    borderSpacing: 0,
  },
};

const Table = ({ style, body, headings, ...props }) => (
  <table style={{ ...styles.table, ...style }} {...props}>
    <thead>
      <Tr>
        {headings}
      </Tr>
    </thead>
    {body}
  </table>
);

Table.propTypes = {
  headings: PropTypes.node,
  body: PropTypes.node,
  style: PropTypes.object,
};

export default Table;
