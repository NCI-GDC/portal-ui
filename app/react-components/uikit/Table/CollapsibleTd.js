// Vendor
import React, { PropTypes } from 'react';
import { withState } from 'recompose';


import theme from '../../theme';
/*----------------------------------------------------------------------------*/

const styles = {
  td: {
    padding: '3px',
    border: '1px solid #ddd',
    whiteSpace: 'nowrap',
  },
};

const enhance = withState('expanded', 'toggleExpand', false);
const CollapsibleTd = enhance(({ style, text, expanded, toggleExpand, ...props }) => {
  return (
  <td style={{ ...styles.td, ...style }} {...props}>
    <div>
      {expanded || text.length <= 250 ? text : `${text.substring(0, 250)}\u2026`}
    </div>
    { text.length > 250 &&
      (<div style={{
        textAlign: 'right',
        fontStyle: 'italic',
        color: theme.primary,
      }} onClick={() => toggleExpand(v => !v)}>
        {expanded ? '\u25B4 less' : '\u25BE more'}
      </div>)
    }
  </td>
  );
});

CollapsibleTd.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

/*----------------------------------------------------------------------------*/

export default CollapsibleTd;
