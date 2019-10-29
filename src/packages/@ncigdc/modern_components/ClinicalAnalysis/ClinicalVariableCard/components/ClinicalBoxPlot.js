import React from 'react';

import { Row, Column } from '@ncigdc/uikit/Flex';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import {
  humanify,
} from '@ncigdc/utils/string';
import { TooltipInjector } from '@ncigdc/uikit/Tooltip';
import { analysisColors } from '@ncigdc/utils/constants';
import BoxPlotWrapper from '@oncojs/boxplot';
import QQPlotQuery from '@ncigdc/modern_components/QQPlot/QQPlotQuery';

import { CHART_HEIGHT } from '../helpers';

const QQ_PLOT_RATIO = '70%';
const BOX_PLOT_RATIO = '30%';

const ClinicalBoxPlot = ({
  boxPlotValues,
  cardFilters,
  dataBuckets,
  downloadChartName,
  fieldName,
  qqData,
  setId,
  setQQData,
  setQQDataIsSet,
  theme,
  totalDocs,
  type = '',
  wrapperId,
}) => (
  <Column
    style={{
      alignItems: 'space-between',
      height: CHART_HEIGHT,
      justifyContent: 'center',
      marginBottom: 10,
      minWidth: 300,
    }}
    >
    <Row 
      className="print-w500"
      style={{ width: '100%' }}
      >
      <Row
        className="print-fl"
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          marginLeft: 10,
          width: BOX_PLOT_RATIO,
        }}
        >
        <span
          className="print-mb print-mt"
          style={{
            color: theme.greyScale2,
            fontSize: '1.2rem',
          }}
          >
          Box Plot
        </span>
      </Row>
      <Row
        className="print-fl"
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 10,
          width: QQ_PLOT_RATIO,
        }}
        >
        <span
          className="print-mb print-mt"
          style={{
            color: theme.greyScale2,
            fontSize: '1.2rem',
          }}
          >
          QQ Plot
        </span>
      </Row>
      <Row>
        <DownloadVisualizationButton
          data={qqData}
          noText
          slug={[
            `${downloadChartName}-qq-plot`,
            `${downloadChartName}-box-plot`,
          ]}
          style={{
            float: 'right',
            marginRight: 2,
          }}
          svg={[
            () => wrapSvg({
              className: 'qq-plot',
              selector: `#${downloadChartName}-qq-plot-container .qq-plot svg`,
              title: `${humanify({ term: fieldName })} QQ Plot`,
            }),
            () => wrapSvg({
              className: `${type.toLowerCase()}-box-plot`,
              selector: `#${downloadChartName}-box-plot-container figure svg`,
              title: `${humanify({ term: fieldName })} Box Plot`,
            }),
          ]}
          tooltipHTML="Download plot data"
          tsvData={qqData}
          />
      </Row>
    </Row>
    <Row
      className="print-w500"
      style={{
        height: CHART_HEIGHT,
        justifyContent: 'space-between',
      }}
      >
      <Column
        className="print-fl"
        id={`${downloadChartName}-box-plot-container`}
        style={{
          height: CHART_HEIGHT + 10,
          maxHeight: CHART_HEIGHT + 10,
          minWidth: '150px',
          width: '150px',
        }}
        >
        <TooltipInjector>
          <BoxPlotWrapper
            color={analysisColors[type]}
            data={boxPlotValues}
            />
        </TooltipInjector>
      </Column>
      <Column
        className="print-fl"
        id={`${downloadChartName}-qq-plot-container`}
        style={{
          height: CHART_HEIGHT + 10,
          maxHeight: CHART_HEIGHT + 10,
          width: QQ_PLOT_RATIO,
        }}
        >
        <QQPlotQuery
          chartHeight={CHART_HEIGHT + 10}
          dataBuckets={dataBuckets}
          dataHandler={data => setQQData(data)}
          fieldName={fieldName}
          filters={cardFilters}
          first={totalDocs}
          qqLineStyles={{ color: theme.greyScale2 }}
          qqPointStyles={{ color: analysisColors[type] }}
          setDataHandler={() => setQQDataIsSet()}
          setId={setId}
          wrapperId={wrapperId}
          />
      </Column>
    </Row>
  </Column>
);

export default ClinicalBoxPlot;
