// Vendor
import React, { PropTypes } from 'react';

const Tooltip = ({ innerHTML, children }) => (
  <span 
    onMouseOver={() => { 
      let tooltip = document.querySelector('.global-tooltip')
      tooltip.innerHTML = innerHTML;
      tooltip.classList.add('active');
    }}
    onMouseOut={() => {
      let tooltip = document.querySelector('.global-tooltip')
      tooltip.innerHTML = '';
      tooltip.classList.remove('active');
    }}
  >
    { children }
  </span>
);

Tooltip.propTypes = {
  innerHtml: PropTypes.string,
  children: PropTypes.node,
}

export default Tooltip;
