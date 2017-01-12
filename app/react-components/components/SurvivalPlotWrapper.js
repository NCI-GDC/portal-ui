import React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import _ from 'lodash';
import { scaleOrdinal, schemeCategory10 } from 'd3';
import { renderPlot } from '@oncojs/survivalplot';

import Column from '../uikit/Flex/Column';
import Row from '../uikit/Flex/Row';
import Button from '../uikit/Button';
import DownloadVisualizationButton from './DownloadVisualizationButton';
import ToolTip from '../uikit/Tooltip';
import { graphTitle, visualizingButton } from '../theme/mixins';
import toMap from '../utils/toMap';

const colors = scaleOrdinal(schemeCategory10);
const palette = [colors(0), colors(1)];

const styles = {
  hidden: {
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
  pValue: {
    fontSize: '1.1rem',
    height: '1.5rem',
    marginTop: '0.5rem',
  },
};

function onMouseEnterDonor(e, donor) {
  const tooltip = document.querySelector('.global-tooltip');
  tooltip.classList.add('active');
  tooltip.innerHTML = `
    ${donor.id}<br>
    Survival Rate: ${Math.round(donor.survivalEstimate * 100)}%<br>
    ${donor.censored ? `Interval of last follow-up: ${donor.time}` : `Time of Death: ${donor.time}`}
  `;
}

function onMouseLeaveDonor() {
  const tooltip = document.querySelector('.global-tooltip')
  tooltip.classList.remove('active');
}

function onClickDonor(e, donor) {
  window.location = `/cases/${donor.id}`;
}

const SurvivalPlotWrapper = ({ height = 0, legend, rawData = {}, setXDomain, setSurvivalContainer }) => {
  const { results = [], overallStats = {} } = rawData;
  const pValue = overallStats.pValue;

  return (
    <div className="survival-plot">
      <Column>
        <span style={{ textAlign: 'right' }}>
          <DownloadVisualizationButton
            svg={'.survival-plot-container svg'}
            data={results}
            stylePrefix=".survival-plot"
            slug="survival-plot"
            noText
            tooltipHTML="Download SurvivalPlot data or image"
            tsvData={
              results.reduce((data, set) => {
                const mapData = set.donors.map((d) => toMap(d));
                return [...data, ...(results.length > 1 ? mapData.map((m, idx) => m.set('mutated', !idx)) : mapData)];
              }, [])
            }
          />
          <ToolTip innerHTML="Reload SurvivalPlot">
            <Button
              style={visualizingButton}
              onClick={() => setXDomain()}
            ><i className="fa fa-undo" /><div style={styles.hidden}>Reset</div></Button>
          </ToolTip>
        </span>
        <div style={graphTitle}>Overall Survival Plot</div>
        <Row style={{ justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {legend &&
            legend.map((text, i) => (
              <div
                key={text}
                style={{
                  color: palette[i],
                  margin: '0 1rem',
                  fontSize: '1.1rem',
                }}
              >{text}</div>
            ))
          }
        </Row>
        {
          <span style={styles.pValue}>
            {pValue && `Log-Rank Test P-Value = ${pValue.toExponential(2)}`}
          </span>
        }
      </Column>
      <div
        className="survival-plot-container"
        ref={setSurvivalContainer}
        style={{ overflow: 'hidden', height, position: 'relative' }}
      />
    </div>
  );
};

function renderSurvivalPlot(props) {
  const { height = 0, getSetSymbol, rawData = {}, xDomain, survivalContainer, setXDomain } = props;
  const { results = [] } = rawData;

  if (results.length && survivalContainer) {
    renderPlot({
      container: survivalContainer,
      dataSets: results,
      palette,
      xDomain,
      xAxisLabel: 'Duration (days)',
      yAxisLabel: 'Survival Rate',
      height,
      getSetSymbol,
      onMouseEnterDonor,
      onMouseLeaveDonor,
      onClickDonor,
      onDomainChange: setXDomain,
      margins: {
        top: 15,
        right: 20,
        bottom: 40,
        left: 50,
      },
    });
  }
}

const enhance = compose(
  withState('xDomain', 'setXDomain', undefined),
  withState('survivalContainer', 'setSurvivalContainer', null),

  lifecycle({
    shouldComponentUpdate(nextProps, nextState) {
      return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    },

    componentDidUpdate() {
      renderSurvivalPlot(this.props);
    },

    componentDidMount() {
      renderSurvivalPlot(this.props);
    },
  })
);

export default enhance(SurvivalPlotWrapper);
