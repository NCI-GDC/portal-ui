// @flow

import React from 'react'
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { noop } from 'lodash';
import { tooltip } from '@ncigdc/uikit/Tooltip';

const TooltipPath = tooltip('path');

const DoubleRingChart = ({
  data,
  getFillColor = noop,
  height = 160,
  width = 160,
  outerRingWidth = 30,
  // setTooltip,
}) => {
  const centerRingWidth = width - outerRingWidth * 2;
  const centerRingHeight = height - outerRingWidth * 2;
  const centerRadius = Math.min(centerRingWidth, centerRingHeight) / 2;
  const radius = Math.min(width, height) / 2;

  const HALF_DEGREE_IN_RAD = 0.00872665;

  const innerPieData = data.map(d => ({
    v: d.value,
    key: d.key,
    tooltip: d.tooltip,
    innerRadius: 0,
    outerRadius: centerRadius - 5,
    clickHandler: d.clickHandler,
  }));

  const innerPie = d3.pie().padAngle(HALF_DEGREE_IN_RAD * 2).value(d => d.v)(
    innerPieData,
  );

  const outerPieData = data.map((d, i) => ({
    items: d.outer.map(p => ({
      v: p.value,
      key: p.key,
      tooltip: p.tooltip,
      clickHandler: p.clickHandler,
    })),
    innerRadius: centerRadius,
    outerRadius: radius,
  }));

  const outerPie = outerPieData.map((p, i) =>
    d3
      .pie()
      .padAngle(HALF_DEGREE_IN_RAD)
      .startAngle(innerPie[i].startAngle)
      .endAngle(innerPie[i].endAngle)(p.items.map(i => i.v)),
  );

  const dataWithPie = [
    innerPieData.map((p, i) => ({
      ...p,
      pie: innerPie[i],
      color: getFillColor(innerPieData[i]),
    })),
    outerPieData.reduce(
      (acc, p, i) => [
        ...acc,
        ...p.items.map((item, j) => ({
          ...p,
          pie: outerPie[i][j],
          v: item.v,
          key: item.key,
          tooltip: item.tooltip,
          color: getFillColor(innerPieData[i]),
          clickHandler: item.clickHandler,
        })),
      ],
      [],
    ),
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {dataWithPie.map((d, i) =>
            <g key={i}>
              {d.map((d, j) =>
                <TooltipPath
                  Component={d.tooltip}
                  onMouseDown={() => d.clickHandler && d.clickHandler()}
                  style={{
                    fill: getFillColor(d) || 'rgb(40, 111, 170)',
                    cursor: 'pointer',
                  }}
                  key={j}
                  d={d3
                    .arc()
                    .outerRadius(d.outerRadius)
                    .innerRadius(d.innerRadius)(d.pie)}
                />,
              )}
            </g>,
          )}
        </g>
      </svg>
    </div>
  );
};

DoubleRingChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.number,
      tooltip: PropTypes.object,
      clickHandler: PropTypes.func,
      outer: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          value: PropTypes.number,
          clickHandler: PropTypes.func,
        }),
      ),
    }),
  ),
  height: PropTypes.number,
  width: PropTypes.number,
  outerRingWidth: PropTypes.number,
};

/*----------------------------------------------------------------------------*/

export default DoubleRingChart;
