import React from 'react';
import {
  compose,
  lifecycle,
  setDisplayName,
  withState,
} from 'recompose';
import {
  isEqual,
  isNumber,
  pick,
  sum,
  uniqueId,
} from 'lodash';
import { scaleOrdinal, schemeCategory10 } from 'd3';
import Color from 'color';

import { renderPlot } from '@oncojs/survivalplot';
import Loader from '@ncigdc/uikit/Loaders/Loader';
import toMap from '@ncigdc/utils/toMap';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { Tooltip, withTooltip } from '@ncigdc/uikit/Tooltip';
import Hidden from '@ncigdc/components/Hidden';
import withRouter from '@ncigdc/utils/withRouter';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import withSize from '@ncigdc/utils/withSize';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import { visualizingButton } from '@ncigdc/theme/mixins';
import VisualizationHeader from '@ncigdc/components/VisualizationHeader';
import { performanceTracker } from '@ncigdc/utils/analytics';
import { MINIMUM_CASES } from '@ncigdc/utils/survivalplot';

import './survivalPlot.css';

const CLASS_NAME = 'survival-plot';

const TITLE = 'Overall Survival Plot';

const SVG_MARGINS = {
  bottom: 40,
  left: 50,
  right: 20,
  top: 15,
};

const colors = scaleOrdinal(schemeCategory10);
const textColors = [
  // based on schemeCategory10
  // 4.5:1 colour contrast for normal text
  '#1f77b4',
  '#BD5800',
  '#258825',
  '#D62728',
  '#8E5FB9',
  '#8C564B',
  '#D42BA1',
  '#757575',
  '#7A7A15',
  '#10828E',
];

const styles = {
  pValue: {
    fontSize: '1.1rem',
    lineHeight: '1.5rem',
    marginTop: '0.5rem',
    textAlign: 'center',
  },
};

const Container = ({
  height,
  setSurvivalContainer,
  survivalDataLoading,
}) => (
  <div
    className={`${CLASS_NAME} test-survival-plot-container`}
    ref={setSurvivalContainer}
    style={{
      height: survivalDataLoading ? '0px' : height,
      overflow: 'hidden',
      position: 'relative',
    }}
    />
);

const SurvivalPlotWrapper = ({
  buttonStyle = {},
  height = 0,
  legend = [],
  rawData: {
    overallStats: { pValue } = {},
    results = [],
  } = {},
  setXDomain,
  setSurvivalContainer,
  survivalDataLoading,
  survivalPlotLoading,
  uniqueClass,
  palette = [
    textColors[0],
    textColors[1],
    textColors[2],
    textColors[3],
    textColors[4],
  ],
  plotType,
  slug = '',
}) => {
  const plotName = slug === '' ? uniqueClass : slug;
  return (
    <Loader
      className={plotName}
      height={height}
      // TODO must handle if no data comes back
      loading={survivalDataLoading || survivalPlotLoading}
      >
      {survivalDataLoading || (
        <Column className="test-survival-plot-meta">
          <VisualizationHeader
            buttons={[
              <DownloadVisualizationButton
                data={results.map((set, i) => ({
                  ...set,
                  meta: {
                    ...set.meta,
                    label: set.meta.label || `S${i + 1}`,
                  },
                }))}
                key="download"
                noText
                slug="survival-plot"
                stylePrefix={`.${CLASS_NAME}`}
                svg={() => wrapSvg({
                  className: CLASS_NAME,
                  embed: {
                    top: {
                      elements: legend
                        .map((l, i) => {
                          const legendItem = document.querySelector(
                            `.${plotName} .legend-${i}`
                          ).cloneNode(true);
                          const legendTitle = legendItem.querySelector('span.print-only.inline');
                          if (legendTitle !== null) legendTitle.className = '';
                          return legendItem;
                        })
                        .concat(
                          pValue
                            ? document.querySelector(
                              `.${plotName} .p-value`
                            )
                            : null
                        ),
                    },
                  },
                  selector: `.${plotName} .${CLASS_NAME} svg`,
                  title: plotType === 'mutation' ? TITLE : '',
                })}
                tooltipHTML="Download SurvivalPlot data or image"
                tsvData={results.reduce((data, set, i) => {
                  const mapData = set.donors.map(d => toMap(d));
                  return [
                    ...data,
                    ...(results.length > 1
                      ? mapData.map(m => m.set('label', set.meta.label || `S${i + 1}`))
                      : mapData),
                  ];
                }, [])}
                />,
              <Tooltip Component="Reset SurvivalPlot Zoom" key="reset">
                <Button onClick={() => setXDomain()} style={visualizingButton}>
                  <i className="fa fa-undo" />
                  <Hidden>Reset</Hidden>
                </Button>
              </Tooltip>,
            ]}
            style={buttonStyle}
            title={plotType === 'mutation' ? TITLE : ''}
            />

          <div>
            <Row
              className="survival-legend-wrapper"
              style={{
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: '0.5rem',
              }}
              >
              {legend &&
                legend.map((l, i) => (
                  <div
                    className={`legend-item legend-${i}`}
                    key={l.key}
                    style={l.style || {}}
                    >
                    <div
                      style={{
                        color: Color(palette[i]).darken(0.3)
                          .rgbString(),
                        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontSize: '1.35rem',
                        padding: '0 1rem',
                        textAlign: 'center',
                      }}
                      >
                      {l.value}
                    </div>
                  </div>
                ))}
            </Row>
          </div>

          <Tooltip
            Component={
              pValue === 0 && (
                <div>
                  Value shows 0.00e+0 because the
                  <br />
                  P-Value is extremely low and goes beyond
                  <br />
                  the precision inherent in the code
                </div>
              )
            }
            >
            <div className="p-value">
              <div style={styles.pValue}>
                {isNumber(pValue) &&
                  `Log-Rank Test P-Value = ${pValue.toExponential(2)}`}
              </div>
            </div>
          </Tooltip>

          <div
            className="no-print"
            style={{
              fontSize: '1.1rem',
              marginBottom: -SVG_MARGINS.top,
              marginRight: SVG_MARGINS.right,
              textAlign: 'right',
            }}
            >
            drag to zoom
          </div>
        </Column>
      )}

      <Container
        setSurvivalContainer={setSurvivalContainer}
        survivalDataLoading={survivalDataLoading}
        />
    </Loader>
  );
};

function renderSurvivalPlot({
  height = 0,
  palette = [
    colors(0),
    colors(1),
    colors(2),
    colors(3),
    colors(4),
  ],
  push,
  rawData: { results = [] } = {},
  setSurvivalPlotLoading,
  setTooltip,
  setXDomain,
  survivalContainer,
  xDomain,
}) {
  if (survivalContainer) {
    performanceTracker.begin('survival:render');
    setSurvivalPlotLoading(true);
    renderPlot({
      container: survivalContainer,
      dataSets: results,
      getSetSymbol: (curve, curves) => (
        curves.length === 1
          ? ''
          : `<tspan font-style="italic">S</tspan><tspan font-size="0.7em" baseline-shift="-15%">${
            curves.indexOf(curve) + 1
            }</tspan>`
      ),
      height,
      margins: SVG_MARGINS,
      minimumDonors: MINIMUM_CASES,
      onClickDonor: (e, donor) => push({ pathname: `/cases/${donor.id}` }),
      onDomainChange: setXDomain,
      onMouseEnterDonor: (e, {
        censored,
        project_id,
        submitter_id,
        survivalEstimate,
        time = 0,
      }) => {
        setTooltip(
          <span>
            {`Case ID: ${project_id} / ${submitter_id}`}
            <br />
            {`Survival Rate: ${Math.round(survivalEstimate * 100)}%`}
            <br />
            {censored
              ? `Interval of last follow-up: ${time.toLocaleString()} years`
              : `Time of Death: ${time.toLocaleString()} years`}
          </span>
        );
      },
      onMouseLeaveDonor: () => setTooltip(),
      palette,
      shouldShowConfidenceIntervals: false,
      xAxisLabel: 'Duration (years)',
      xDomain,
      yAxisLabel: 'Survival Rate',
    });
    const performanceContext = {
      data_sets: results.length,
      donors: sum(results.map(x => x.donors.length)),
    };
    setSurvivalPlotLoading(false);
    performanceTracker.end('survival:render', performanceContext);
  }
}

export default compose(
  setDisplayName('EnhancedSurvivalPlotWrapper'),
  withTooltip,
  withRouter,
  withState('xDomain', 'setXDomain', undefined),
  withState('survivalContainer', 'setSurvivalContainer', null),
  withState('survivalPlotLoading', 'setSurvivalPlotLoading', true),
  withState('uniqueClass', 'setUniqueClass', () => CLASS_NAME + uniqueId()),
  withSize({ refreshRate: 16 }),
  lifecycle({
    componentDidMount() {
      this.props.survivalDataLoading || renderSurvivalPlot(this.props);
    },
    componentDidUpdate() {
      this.props.survivalDataLoading || renderSurvivalPlot(this.props);
    },
    shouldComponentUpdate(nextProps) {
      const props = [
        'xDomain',
        'size',
        'rawData',
        'survivalDataLoading',
        'survivalPlotLoading',
        'survivalContainer',
      ];
      return !isEqual(
        pick(this.props, props),
        pick(nextProps, props)
      );
    },
  })
)(SurvivalPlotWrapper);
