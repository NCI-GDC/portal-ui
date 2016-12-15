import React from 'react';

import Column from '../uikit/Flex/Column';
import Row from '../uikit/Flex/Row';
import BarChart from '../charts/BarChart';
import theme from '../theme';
import EntityPageHorizontalTable from './EntityPageHorizontalTable';
import DownloadVisualizationButton from '../components/DownloadVisualizationButton';

const styles = {
  button: {
    color: '#333',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    marginRight: 12,
    minWidth: 46,
    minHeight: 34,
    display: 'inline-flex',
  },
  hidden: {
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
  column: {
    width: '100%',
    minWidth: 450,
  },
};

const CancerDistribution = ({
  chartData,
  tableData,
  tableHeadings,
  tagline,
}) => {
  return (
    <Column>
      <h5 style={{ textTransform: 'uppercase', padding: '0 2rem' }}>
        {tagline}
      </h5>
      {chartData.length >= 5 && <Row style={{ padding: '0 2rem', justifyContent: 'center' }}>
        <span>
          <div style={{ textAlign: 'right' }}>
            <DownloadVisualizationButton
              svg="#cancer-distribution svg"
              data={chartData.map(d => ({ label: d.label, value: d.value }))}
              slug="bar-chart"
              noText
              tooltipHTML="Download image or data"
            />
          </div>
          <BarChart
            bandwidth={50}
            data={chartData}
            yAxis={{ title: '% of Cases Affected' }}
            styles={{
              xAxis: { stroke: theme.greyScale4, textFill: theme.greyScale3 },
              yAxis: { stroke: theme.greyScale4, textFill: theme.greyScale3 },
              bars: { fill: theme.secondary },
              tooltips: {
                fill: '#fff',
                stroke: theme.greyScale4,
                textFill: theme.greyScale3,
              },
            }}
          />
        </span>
      </Row>}
      <Column style={{ ...styles.column }}>
        <EntityPageHorizontalTable
          headings={tableHeadings}
          data={tableData}
        />
      </Column>
    </Column>
  );
};

export default CancerDistribution;
