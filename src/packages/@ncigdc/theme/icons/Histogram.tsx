import React from 'react';

interface IIconProps {
  width?: string;
  height?: string;
  style?: any;
}

export default ({
  width = '100%',
  height = '100%',
  style = {},
}: IIconProps) => (
  <svg
    id="histogram"
    viewBox="0 0 66.07 53.05"
    width={width}
    height={height}
    style={{ display: 'block', ...style }}
  >
    <rect
      style={{ fill: '#fff' }}
      x="14.03"
      y="26.53"
      width="8.66"
      height="17.82"
    />
    <polygon
      style={{ fill: '#fff' }}
      points="5.48 47.57 5.48 0 0 0 0 53.05 0.89 53.05 5.48 53.05 66.07 53.05 66.07 47.57 5.48 47.57"
    />
    <rect
      style={{ fill: '#fff' }}
      x="25.64"
      y="8.68"
      width="8.66"
      height="35.66"
    />
    <rect
      style={{ fill: '#fff' }}
      x="37.25"
      y="18.09"
      width="8.66"
      height="26.25"
    />
    <rect
      style={{ fill: '#fff' }}
      x="48.86"
      y="5.79"
      width="8.66"
      height="38.55"
    />
  </svg>
);
