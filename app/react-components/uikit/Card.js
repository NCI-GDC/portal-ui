// Vendor
import React, { PropTypes } from 'react';

// Custom
import { cardTitle } from '../theme/mixins';

/*----------------------------------------------------------------------------*/

const styles = {
  card: {
    backgroundColor: 'white',
  },
};

const Card = ({ style, children, title, headerStyle, ...props }) => (
  <div style={{ ...styles.card, ...style }} {...props}>
    {title && <div style={{ ...cardTitle, ...(headerStyle || {}) }}>{title}</div>}
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  title: PropTypes.node,
};

/*----------------------------------------------------------------------------*/

export default Card;
