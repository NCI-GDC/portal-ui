import React from 'react';
import PieChart from '@ncigdc/components/Charts/PieChart';
import * as d3 from 'd3';

const color = d3.scaleOrdinal(d3.schemeCategory20);

const SampleTypeCard = ({ data }) => (
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    }}
    >
    <PieChart
      data={data}
      enableInnerRadius
      height={200}
      marginTop={25}
      path="count"
      width={200}
      />
    <ul
      style={{
        listStyleType: 'none',
        maxHeight: '60%',
        overflow: 'scroll',
      }}
      >
      {data.map((d, i) => {
        return (
          <li
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
            >
            <span
              style={{
                backgroundColor: `${color(i)}`,
                border: '1px solid rgba(0, 0, 0, .2)',
                height: '10px',
                margin: 'auto 3px',
                width: '10px',
              }}
              />
            {d.id}
          </li>
        );
      })}
    </ul>
  </div>
);
export default SampleTypeCard;
