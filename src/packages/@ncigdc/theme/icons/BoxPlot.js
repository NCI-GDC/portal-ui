import React from 'react';

export default ({ style = {}, ...props }) => (
  <svg viewBox="0 0 66.07 53.05" style={{ ...style }}>
    <polygon
      style={{ fill: 'currentcolor' }}
      points="5.48 47.57 5.48 0 0 0 0 53.05 0.89 53.05 5.48 53.05 66.07 53.05 66.07 47.57 5.48 47.57"
    />
    <path
      style={{ fill: 'currentcolor' }}
      d="M63.75,43.15h-.44C43.62,39.93,47.59,8.06,36.67,8.06c-11.42.25-6,30.55-26.82,35.09l-.38.13h0v.12a.27.27,0,0,0,.26.25h54A.27.27,0,0,0,64,43.4C63.94,43.28,63.87,43.15,63.75,43.15Z"
    />
  </svg>
);
