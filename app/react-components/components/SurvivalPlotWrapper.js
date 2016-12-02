import React, { Component } from 'react';
import _ from 'lodash';
import { scaleOrdinal, schemeCategory10 } from 'd3';
import { renderPlot } from '@oncojs/survivalplot';

import Column from '../uikit/Flex/Column';
import Row from '../uikit/Flex/Row';
import { isFullScreen } from '../utils/fullscreen';
import Button from '../uikit/Button';
import DownloadVisualizationButton from './DownloadVisualizationButton'
import ToolTip from '../uikit/Tooltip';
import theme from '../theme';

const colors = scaleOrdinal(schemeCategory10);
const palette = [colors(0), colors(1)]

const styles = {
  heading: {
    flexGrow: 1,
    fontSize: '2rem',
    marginBottom: 7,
    marginTop: 7,
  },
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
  pValue: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    fontSize: '1.1rem',
  },
  graphTitle: {
    textAlign: 'center',
    color: theme.greyScale3,
    fontSize: '1rem',
    fontWeight: 300,
  },
};

class SurvivalPlotWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      xDomain: undefined,
      stack: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.resetXDomain());
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentDidUpdate() {
    this.update();
  }

  componentDidMount() {
    this.update();
  }

  onDomainChange(xDomain) {
    this.setState({
      stack: this.state.stack.concat(this.state.xDomain),
      xDomain,
    });
  }

  update() {
    const { xDomain } = this.state;
    const {
      height = 0,
      getSetSymbol,
      rawData = {},
      margins = {
        top: 15,
        right: 20,
        bottom: 40,
        left: 50,
      },
      onMouseEnterDonor,
      onMouseLeaveDonor,
      onClickDonor,
    } = this.props;

    const dataSets = rawData.results;
    const container = this.survivalContainer;
    const onDomainChange = this.onDomainChange.bind(this);

    if (dataSets) {
      renderPlot({
        container,
        dataSets,
        palette,
        xDomain,
        xAxisLabel: 'Duration (days)',
        yAxisLabel: 'Survival Rate',
        height: isFullScreen(container) ? (window.innerHeight - 100) : height,
        getSetSymbol,
        onMouseEnterDonor,
        onMouseLeaveDonor,
        onClickDonor,
        onDomainChange,
        margins,
      });
    }
  }

  resetXDomain() {
    const { stack, xDomain } = this.state;

    return {
      stack: [],
      xDomain: stack.length ? stack[0] : xDomain,
    };
  }

  reset() {
    this.props.onReset();
  }

  render() {
    const { dataSets } = this.state;
    const { height, width, legend, rawData = {} } = this.props;
    const pValue = (rawData.overallStats || {}).pValue;

    return (
      <div className="survival-plot">
        <Column id="survival-plot">
          <span style={{ textAlign: 'right' }}>
            <DownloadVisualizationButton
              svg={`.survival-plot svg`} // TODO: make sure this selects the correct survivalplot
              data={dataSets}
              stylePrefix=".survival-plot"
              slug="survival-plot"
              noText={true}
              tooltipHTML="Download SurvivalPlot data or image"
            />
            <ToolTip innerHTML="Reload SurvivalPlot">
              <Button
                style={styles.button}
                onClick={() => this.setState(this.resetXDomain())}
              ><i className="fa fa-undo" /><div style={styles.hidden}>Reset</div></Button>
            </ToolTip>
          </span>
          <div style={styles.graphTitle}>Overall Survival Plot</div>
          {pValue && <span style={styles.pValue}>Log-Rank Test P-Value = {pValue.toExponential(2)}</span>}
        </Column>
        <div ref={(c) => { this.survivalContainer = c; }} />
        <Row style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
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
      </div>
    );
  }
}

SurvivalPlotWrapper.propTypes = {
  height: React.PropTypes.number,
  getSetSymbol: React.PropTypes.func,
  margins: React.PropTypes.shape({}),
  onReset: React.PropTypes.func,
  onMouseEnterDonor: React.PropTypes.func,
  onMouseLeaveDonor: React.PropTypes.func,
  onClickDonor: React.PropTypes.func,
};

SurvivalPlotWrapper.defaultProps = {
  onReset: () => {},
  onMouseEnterDonor: (e, donor) => {
    const tooltip = document.querySelector('.global-tooltip');
    tooltip.classList.add('active');
    tooltip.innerHTML = `
      ${donor.id}<br>
      Survival Rate: ${Math.round(donor.survivalEstimate * 100)}%<br>
      ${donor.censored ? `Interval of last follow-up: ${donor.time}` : `Time of Death: ${donor.time}`}
    `;
  },
  onMouseLeaveDonor: () => {
    const tooltip = document.querySelector('.global-tooltip')
    tooltip.classList.remove('active');
  },
  onClickDonor: (e, donor) => {
    window.location = `/cases/${donor.id}`;
  },
};

export default SurvivalPlotWrapper;
