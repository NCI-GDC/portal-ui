// @flow
import React from 'react';

const GroupIcon = ({ color = '#333', ...props }) => (
  <svg
    data-name="Layer 1"
    id="Layer_1"
    viewBox="0 0 90.47 79.63"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    >
    <path
      d="M.47,20h90V0H.47M86.82,16.5H4.25V3.81H86.82Z"
      style={{
        fill: color,
        fillOpacity: 0.99,
      }}
      />
    <path
      d="M0,50.08H90v-20H0"
      style={{
        fill: color,
        fillOpacity: 0.99,
      }}
      />
    <path
      d="M0,79.63H90v-20H0"
      style={{
        fill: color,
        fillOpacity: 0.99,
      }}
      />
  </svg>
);

export default GroupIcon;
