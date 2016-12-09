// Vendor
import React, { PropTypes } from 'react';

const DEFAULT_MAX_WIDTH = 'none';
const DEFAULT_DIR = 'up';

const Tooltip = ({ innerHTML, children, dir = DEFAULT_DIR, maxWidth = DEFAULT_MAX_WIDTH }) => (
  <span
    onMouseOver={() => {
      const tooltip = document.querySelector('.global-tooltip');

      if (DEFAULT_DIR !== dir) {
        tooltip.classList.remove(DEFAULT_DIR);
        tooltip.classList.add(dir);
      }

      tooltip.innerHTML = innerHTML;
      tooltip.style.maxWidth = maxWidth;
      tooltip.classList.add('active');
    }}
    onMouseOut={() => {
      const tooltip = document.querySelector('.global-tooltip');

      tooltip.classList.remove('active');
      tooltip.innerHTML = '';
      tooltip.style.maxWidth = DEFAULT_MAX_WIDTH;

      if (DEFAULT_DIR !== dir) {
        tooltip.classList.remove(dir);
        tooltip.classList.add(DEFAULT_DIR);
      }
    }}
  >
    { children }
  </span>
);

Tooltip.propTypes = {
  innerHtml: PropTypes.string,
  children: PropTypes.node,
  dir: PropTypes.string,
  maxWidth: PropTypes.string,
};

export default Tooltip;
