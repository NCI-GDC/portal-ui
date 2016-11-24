// Vendor
import React, { PropTypes } from 'react';

const Tooltip = ({ innerHTML, children, dir = 'up' }) => (
  <span 
    onMouseOver={() => { 
      let tooltip = document.querySelector('.global-tooltip')
      tooltip.innerHTML = innerHTML;
      tooltip.classList.add(dir);
      tooltip.classList.add('active');
    }}
    onMouseOut={() => {
      let tooltip = document.querySelector('.global-tooltip')
      tooltip.innerHTML = '';
      tooltip.classList.remove('active');
      tooltip.classList.remove(dir);
    }}
  >
    { children }
  </span>
);

Tooltip.propTypes = {
  innerHtml: PropTypes.string,
  children: PropTypes.node,
  dir: PropTypes.string,
}

export default Tooltip;
