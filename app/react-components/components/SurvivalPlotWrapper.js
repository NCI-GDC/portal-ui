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

function processData(dataSet, id) {
  return {
    meta: { id },
    donors: _.flatten(dataSet.map(interval =>
      interval.donors.map(donor =>
        _.extend({}, donor, {
          survivalEstimate: interval.cumulativeSurvival,
        })
      )
    )),
  };
}

function buildData(props) {
  return Promise.resolve()
    .then(() => {
      const { gene, rawData } = props;

      if (gene) {
        return fetch('https://dcc.icgc.org/api/v1/analysis/survival/b8a57661-67d1-45d2-a9aa-b9a7a12b12ff')
          .then(r => r.json())
          .then(geneData => ({
            dataSets: [
              processData(geneData.results[0].overall, `${gene}1`),
              processData(geneData.results[1].overall, `${gene}2`),
            ],
            legend: [
              `${gene.survivalId} mutated cases`,
              `${gene.survivalId} not mutated cases`,
            ],
            pValue: geneData.overallStats.pValue.toExponential(2),
          }));
      }

      return {
        dataSets: [processData(rawData, 'project')],
        legend: ['all cases in project'],
        pValue: '',
      };
    });
}

class SurvivalPlotWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      xDomain: undefined,
      stack: [],
      palette: [colors(0), colors(1)],
      disabledDataSets: undefined,
      dataSets: null,
    };
  }

  componentDidMount() {
    buildData(this.props).then(d => this.setState(d));
  }

  componentWillReceiveProps(nextProps) {
    buildData(nextProps).then((newState) => {
      if (!_.isEqual(newState, this.state)) {
        this.setState({
          ...this.resetXDomain(),
          ...newState,
        });
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentDidUpdate() {
    this.update();
  }

  onDomainChange(xDomain) {
    this.setState({
      stack: this.state.stack.concat(this.state.xDomain),
      xDomain,
    });
  }

  update() {
    const { disabledDataSets, dataSets, palette, xDomain } = this.state;
    const {
      height = 0,
      getSetSymbol,
      margins = {
        top: 15,
        right: 20,
        bottom: 40,
        left: 50,
      },
    } = this.props;

    const container = this.survivalContainer;
    const onDomainChange = this.onDomainChange.bind(this);

    if (dataSets) {
      renderPlot({
        container,
        dataSets,
        disabledDataSets,
        palette,
        xDomain,
        xAxisLabel: 'Duration (days)',
        yAxisLabel: 'Survival Rate',
        height: isFullScreen(container) ? (window.innerHeight - 100) : height,
        getSetSymbol,
        onMouseEnterDonor: () => {},
        onMouseLeaveDonor: () => {},
        onClickDonor: () => {},
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
    const { legend, pValue, palette, dataSets } = this.state;

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
                onClick={() => this.reset()}
              ><i className="fa fa-undo" /><div style={styles.hidden}>Reset</div></Button>
            </ToolTip>
          </span>
          <div style={styles.graphTitle}>Overall Survival Plot</div>
          {pValue && <span style={styles.pValue}>Log-Rank Test P-Value = {pValue}</span>}
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
};

SurvivalPlotWrapper.defaultProps = {
  onReset: () => {},
};

export default SurvivalPlotWrapper;
