// @flow

import React from 'react';
import {
  compose,
  lifecycle,
  setDisplayName,
  withState,
} from 'recompose';
import _ from 'lodash';
import { scaleOrdinal, schemeCategory10 } from 'd3';
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

type TProps = {
  height: number,
  legend: Array<{
    key: string,
    value: any,
  }>,
  rawData: {
    results: Array<{
      donors: Array<Object>,
      meta: {
        id: string | number,
        label: string,
      },
    }>,
    overallStats: {
      pValue: number,
    },
  },
  setXDomain: Function,
  setSurvivalContainer: Function,
  survivalPlotLoading: boolean,
  xDomain: Array<number>,
  survivalContainer: Element,
  setTooltip: Function,
  push: Function,
  uniqueClass: string,
};

const TITLE = 'Overall Survival Plot';

const SVG_MARGINS = {
  top: 15,
  right: 20,
  bottom: 40,
  left: 50,
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
  survivalPlotLoading,
}) => (
  <div
    className={`${CLASS_NAME} test-survival-plot-container`}
    ref={setSurvivalContainer}
    style={{
      overflow: 'hidden',
      height: survivalPlotLoading ? '0px' : height,
      position: 'relative',
    }}
    />
);

const SurvivalPlotWrapper = ({
  buttonStyle = {},
  height = 0,
  legend = [],
  rawData,
  setXDomain,
  setSurvivalContainer,
  survivalPlotLoading = false,
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
}: TProps) => {
  const { results = [], overallStats = {} } = rawData || {};
  const { pValue } = overallStats;
  const plotName = slug === '' ? uniqueClass : slug;
  return (
    <Loader
      className={plotName}
      height={height}
      loading={survivalPlotLoading}
      >
      {!survivalPlotLoading && (
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
                slug={plotName}
                stylePrefix={`.${CLASS_NAME}`}
                svg={() => wrapSvg({
                  selector: `.${plotName} .${CLASS_NAME} svg`,
                  title: plotType === 'mutation' ? TITLE : '',
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
                })
                }
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
                justifyContent: 'center',
                flexWrap: 'wrap',
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
                        color: palette[i],
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
          {
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
                  {_.isNumber(pValue) &&
                    `Log-Rank Test P-Value = ${pValue.toExponential(2)}`}
                </div>
              </div>
            </Tooltip>
          }
          <div
            className="no-print"
            style={{
              textAlign: 'right',
              marginBottom: -SVG_MARGINS.top,
              marginRight: SVG_MARGINS.right,
              fontSize: '1.1rem',
            }}
            >
            drag to zoom
          </div>
        </Column>
      )}
      <Container
        setSurvivalContainer={setSurvivalContainer}
        survivalPlotLoading={survivalPlotLoading}
        />
    </Loader>
  );
};

function renderSurvivalPlot(props: TProps): void {
  const {
    height = 0,
    rawData = {},
    xDomain,
    survivalContainer,
    setXDomain,
    setTooltip,
    push,
    palette = [
      colors(0),
      colors(1),
      colors(2),
      colors(3),
      colors(4),
    ],
  } = props;
  const { results = [] } = rawData;
  if (survivalContainer) {
    performanceTracker.begin('survival:render');
    renderPlot({
      container: survivalContainer,
      dataSets: results,
      palette,
      xDomain,
      xAxisLabel: 'Duration (years)',
      yAxisLabel: 'Survival Rate',
      height,
      getSetSymbol: (curve, curves) => (curves.length === 1
        ? ''
        : `<tspan font-style="italic">S</tspan><tspan font-size="0.7em" baseline-shift="-15%">${curves.indexOf(
          curve
        ) + 1}</tspan>`),
      onMouseEnterDonor: (
        e,
        {
          censored, project_id, submitter_id, survivalEstimate, time = 0,
        }
      ) => {
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
      onClickDonor: (e, donor) => push({ pathname: `/cases/${donor.id}` }),
      onDomainChange: setXDomain,
      margins: SVG_MARGINS,
      shouldShowConfidenceIntervals: false,
      minimumDonors: MINIMUM_CASES,
    });
    const performanceContext = {
      data_sets: results.length,
      donors: _.sum(results.map(x => x.donors.length)),
    };
    performanceTracker.end('survival:render', performanceContext);
  }
}

const enhance = compose(
  setDisplayName('EnhancedSurvivalPlotWrapper'),
  withTooltip,
  withRouter,
  withState('xDomain', 'setXDomain', undefined),
  withState('survivalContainer', 'setSurvivalContainer', null),
  withState('uniqueClass', 'setUniqueClass', () => CLASS_NAME + _.uniqueId()),
  withSize({ refreshRate: 16 }),
  lifecycle({
    shouldComponentUpdate(nextProps: TProps): void {
      const props = [
        'xDomain',
        'size',
        'rawData',
        'survivalPlotLoading',
        'survivalContainer',
      ];
      return !_.isEqual(_.pick(this.props, props), _.pick(nextProps, props));
    },

    componentDidUpdate(): void {
      if (!this.props.survivalPlotLoading) renderSurvivalPlot(this.props);
    },

    componentDidMount(): void {
      if (!this.props.survivalPlotLoading) renderSurvivalPlot(this.props);
    },
  })
);

export default enhance(SurvivalPlotWrapper);
