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
      flex: 1,
      justifyContent: 'center',
      padding: '0 15px',
    }}
    >
      {data.length === 0
        ? <span>There is no data for this field.</span>
        : (
          <React.Fragment>
            <div style={{ width: '60%' }}>
              <PieChart
                data={data}
                diameter={280}
                enableInnerRadius
                isResponsive
                mappingId={mappingId}
                marginTop={0}
                path="doc_count"
                />
            </div>
            <div style={{ flex: '0 0 160px' }}>
            {data.length > LEGEND_COUNT && (
              <h3 style={{ marginTop: 0 }}>
                {`Top ${LEGEND_COUNT}`}
              </h3>
            )}
            <ul
              style={{
                listStyleType: 'none',
                maxHeight: '60%',
                overflow: 'auto',
                paddingLeft: 20,
              }}
              >
              {data.slice(0, LEGEND_COUNT).map(datum => (
                <li
                  key={datum.key}
                  style={{ position: 'relative' }}
                  >
                  <div
                    style={{
                      backgroundColor: datum.color,
                      border: `1px solid ${theme.greyScale4}`,
                      height: 10,
                      left: '-20px',
                      position: 'absolute',
                      top: 5,
                      width: 10,
                    }}
                    />
                  {datum.key}
                </li>
              ))}
            </ul>
          </div>
          </React.Fragment>
        )
      }
  </Row>
);
export default SampleTypeCard;
