import React from 'react';

export default ({ style, ...props }) => (
  <svg
    style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeMiterlimit: '1.5',
      height: '4em',
      marginBottom: '-0.1em',
      fill: 'currentcolor',
      flexBasis: 16,
      ...style,
    }}
    viewBox="0 0 66.75 91.78"
    {...props}>
    <g data-name="Layer 1">
      <path
        d="M17.73,0a2.4,2.4,0,0,0-2.18,3L17.08,8H2.31A2.4,2.4,0,0,0,0,10.27v79.2a2.4,2.4,0,0,0,2.31,2.31H64.43a2.41,2.41,0,0,0,2.32-2.31V10.27A2.41,2.41,0,0,0,64.43,8H49.64L51.2,3A2.43,2.43,0,0,0,49,0Zm3.19,4.63H45.86c-1.34,4.18-2.64,8.36-4,12.55h-17Q22.86,10.91,20.92,4.63Z"
        style={{ fill: '#6d3c81' }} />
      <path
        d="M33.11,24.64h.23a2.32,2.32,0,0,1,2.35,2.28v8h8a2.32,2.32,0,0,1,0,4.63h-8v8a2.32,2.32,0,1,1-4.63,0v-8h-8a2.32,2.32,0,0,1,0-4.63h8V27A2.32,2.32,0,0,1,33.11,24.64Z"
        style={{ fill: '#fff' }} />
    </g>
    <g data-name="Layer 2">
      <rect
        height="9.21"
        style={{ fill: '#fea669' }}
        width="4.47"
        x="23.55"
        y="71.86" />
      <polygon
        points="19.13 82.74 19.13 58.15 16.3 58.15 16.3 85.57 16.76 85.57 19.13 85.57 50.45 85.57 50.45 82.74 19.13 82.74"
        style={{ fill: '#fff' }} />
      <rect
        height="18.43"
        style={{ fill: '#9ba0d1' }}
        width="4.47"
        x="29.55"
        y="62.64" />
      <rect
        height="13.57"
        style={{ fill: '#55b7ec' }}
        width="4.47"
        x="35.55"
        y="67.5" />
      <rect
        height="19.92"
        style={{ fill: '#d3d567' }}
        width="4.47"
        x="41.55"
        y="61.15" />
    </g>
  </svg>
);
