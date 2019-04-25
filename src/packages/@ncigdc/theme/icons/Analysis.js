// @flow
import React from 'react';

export default ({ style, ...props }) => (
  <svg
    style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeMiterlimit: '1.5',
      height: '1em',
      marginBottom: '-0.1em',
      fill: 'currentcolor',
      flexBasis: 16,
      ...style,
    }}
    viewBox="0 0 163 171"
    {...props}>
    <g transform="matrix(1,0,0,1,-20.0712,-18.1093)">
      <rect
        height="10.007"
        transform="matrix(0.367892,-0.929869,0.929869,0.367892,12.305,100.296)"
        width="37.648"
        x="21.649"
        y="47.42" />
      <rect
        height="10.007"
        transform="matrix(0.367892,-0.929869,0.293822,0.116247,59.7685,78.786)"
        width="37.648"
        x="21.649"
        y="47.42" />
      <rect
        height="10.007"
        transform="matrix(1.25329,1.02537,-0.177439,0.216882,85.7253,6.23694)"
        width="37.648"
        x="21.649"
        y="47.42" />
      <rect
        height="10.007"
        transform="matrix(1.73109,-0.539599,0.259047,0.831051,-0.935648,91.433)"
        width="37.648"
        x="21.649"
        y="47.42" />
      <rect
        height="10.007"
        transform="matrix(1.5588,-0.485893,-0.0977958,-0.31374,87.3457,130.177)"
        width="37.648"
        x="21.649"
        y="47.42" />
      <path
        d="M157.571,131.331C157.571,128.94 155.423,126.998 152.777,126.998L150.159,126.998C147.513,126.998 145.365,128.94 145.365,131.331L145.365,170.692C145.365,173.084 147.513,175.025 150.159,175.025L152.777,175.025C155.423,175.025 157.571,173.084 157.571,170.692L157.571,131.331Z"
        transform="matrix(0.805101,-0.787489,0.871297,0.890783,-131.262,146.1)" />
      <circle
        cx="42.319"
        cy="75.048"
        r="37.697"
        style={{
          fill: 'none',
          stroke: 'currentcolor',
          strokeWidth: '3.73px',
        }}
        transform="matrix(1.20684,0,0,1.20684,19.2428,17.278)" />
      <circle
        cx="81.242"
        cy="118.145"
        r="20.086"
        transform="matrix(0.968835,0,0,0.968835,-17.4066,1.50716)" />
      <circle
        cx="81.242"
        cy="118.145"
        r="20.086"
        transform="matrix(0.952013,0,0,0.952013,83.4386,-21.3667)" />
      <circle
        cx="81.242"
        cy="118.145"
        r="20.086"
        transform="matrix(0.606962,0,0,0.606962,44.9703,-37.9085)" />
    </g>
  </svg>
);
