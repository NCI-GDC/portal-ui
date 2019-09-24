import React from 'react';
import PieChart from '@ncigdc/components/Charts/PieChart';
import { Row } from '@ncigdc/uikit/Flex';
import { theme } from '@ncigdc/theme/index';

const LEGEND_COUNT = 5;

const SampleTypeCard = ({ data, mappingId }) => (
  <Row
    spacing={15}
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 15px',
    }}
    >
    <PieChart
      data={data}
      enableInnerRadius
      height={280}
      mappingId={mappingId}
      marginTop={30}
      path="doc_count"
      width={280}
      />
    <div>
      {data.length > LEGEND_COUNT && <h3>Top {LEGEND_COUNT}</h3>}
      <ul
        style={{
          listStyleType: 'none',
          maxHeight: '60%',
          overflow: 'auto',
          paddingLeft: 20,
        }}
        >
          {data.slice(0, LEGEND_COUNT).map(datum => (
            <li style={{ position: 'relative' }}>
              <div style={{
                backgroundColor: datum.color,
                border: `1px solid ${theme.greyScale4}`,
                height: 10,
                left: '-20px',
                position: 'absolute',
                top: 6,
                width: 10,
              }}
              />
              {datum.key}
            </li>
          ))}
      </ul>
    </div>
  </Row>
);
export default SampleTypeCard;
