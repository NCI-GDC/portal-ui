// @flow
import React from 'react';

type TProps = {
  color: string,
  height: number,
  width: number,
};
type TDoubleHelix = (props: TProps) => React.Element<*>;
const DoubleHelix: TDoubleHelix = (
  { width, height, color = 'rgb(107,98,98)' } = {},
) => {
  const ratio: number = 1.83;
  return (
    <svg
      height={!height && width ? Math.ceil(width * ratio) : height || '100%'} // calculate pixel value for IE
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: 1.41421,
      }} // calculate pixel value for IE
      version="1.1"
      viewBox="0 0 20 35"
      width={!width && height ? Math.ceil(height * ratio) : width || '100%'}>
      <g
        id="_db_helix_clip1_Artboard2"
        transform="matrix(1,0,0,1,-2.10153,-2.12636)">
        <rect
          height="34.955"
          style={{ fill: 'none' }}
          width="19.321"
          x="2.102"
          y="2.126" />
        <clipPath id="_db_helix_clip1">
          <rect height="34.955" width="19.321" x="2.102" y="2.126" />
        </clipPath>
        <g clipPath="url(#_db_helix_clip1)">
          <g
            id="_db_helix_clip1_Artboard1"
            transform="matrix(1,0,0,1,-20.1958,-12.2937)">
            <rect
              height="41.611"
              style={{ fill: 'none' }}
              width="24.75"
              x="20.196"
              y="12.294" />
            <path
              d="M41,32C41,28.517 39.007,25.495 36.104,24C39.007,22.505 41,19.483 41,16C41,15.448 40.553,15 40,15C39.447,15 39,15.448 39,16C39,19.86 35.859,23 32,23C29.627,23 27.53,21.811 26.264,20L30,20C30.552,20 31,19.552 31,19C31,18.448 30.552,18 30,18L25.295,18C25.105,17.366 25,16.695 25,16C25,15.448 24.552,15 24,15C23.448,15 23,15.448 23,16C23,19.483 24.994,22.505 27.896,24C24.994,25.495 23,28.517 23,32C23,35.483 24.993,38.505 27.896,40C24.993,41.495 23,44.517 23,48C23,48.553 23.448,49 24,49C24.552,49 25,48.553 25,48C25,44.141 28.14,41 32,41C34.372,41 36.47,42.189 37.736,44L33,44C32.448,44 32,44.447 32,45C32,45.553 32.448,46 33,46L38.705,46C38.895,46.635 39,47.305 39,48C39,48.553 39.447,49 40,49C40.553,49 41,48.553 41,48C41,44.517 39.007,41.495 36.104,40C39.007,38.505 41,35.483 41,32ZM32,39C29.215,39 26.812,37.36 25.685,35L32,35C32.552,35 33,34.553 33,34C33,33.447 32.552,33 32,33L25.08,33C25.033,32.672 25,32.34 25,32C25,31.66 25.033,31.328 25.08,31L29,31C29.552,31 30,30.552 30,30C30,29.448 29.552,29 29,29L25.685,29C26.811,26.639 29.215,25 32,25C34.372,25 36.47,26.189 37.736,28L35,28C34.447,28 34,28.448 34,29C34,29.552 34.447,30 35,30L38.705,30C38.895,30.634 39,31.305 39,32C39,35.859 35.859,39 32,39Z"
              style={{
                fill: color,
                fillRule: 'nonzero',
              }} />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default DoubleHelix;
