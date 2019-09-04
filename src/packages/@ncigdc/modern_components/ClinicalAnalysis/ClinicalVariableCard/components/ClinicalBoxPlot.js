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

import '../../boxplot.css';
import '../../qq.css';

const QQ_PLOT_RATIO = '70%';
const BOX_PLOT_RATIO = '30%';

const ClinicalBoxPlot = ({
  boxPlotValues,
  cardFilters,
  dataBuckets,
  fieldName,
  qqData,
  setId,
  setQQData,
  setQQDataIsSet,
  theme,
  totalDocs,
  type,
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
    <Row style={{ width: '100%' }}>
      <Row
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
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 10,
          width: QQ_PLOT_RATIO,
        }}
        >
        <span
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
          slug={[`qq-plot-${fieldName}`, `boxplot-${fieldName}`]}
          style={{
            float: 'right',
            marginRight: 2,
          }}
          svg={[
            () => wrapSvg({
              className: 'qq-plot',
              selector: `#${wrapperId}-qqplot-container .qq-plot svg`,
              title: `${humanify({ term: fieldName })} QQ Plot`,
            }),
            () => wrapSvg({
              className: `${type.toLowerCase()}-boxplot`,
              selector: `#${wrapperId}-boxplot-container figure svg`,
              title: `${humanify({ term: fieldName })} Box Plot`,
            }),
          ]}
          tooltipHTML="Download plot data"
          tsvData={qqData}
          />
      </Row>
    </Row>
    <Row
      style={{
        height: CHART_HEIGHT,
        justifyContent: 'space-between',
      }}
      >
      <Column
        id={`${wrapperId}-boxplot-container`}
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
        id={`${wrapperId}-qqplot-container`}
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
