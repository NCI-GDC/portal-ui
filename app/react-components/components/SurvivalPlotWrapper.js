import React, { Component } from 'react';
import { SurvivalPlot } from './SurvivalPlot'; // this component should be merged into this one
import { compose, lifecycle, withState } from 'recompose';
import _ from 'lodash';
import Column from '../uikit/Flex/Column';
import Button from '../Button';
import downloadSvg from '../utils/download-svg';

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
}
const map = {
  defaultId: 'b8a57661-67d1-45d2-a9aa-b9a7a12b12ff'
}; 

function processData(dataSet, id) {
  return {
    meta: { id },
    donors: _.flatten(dataSet.map(function (interval) {
      return interval.donors.map(function (donor) {
        return _.extend({}, donor, {
          survivalEstimate: interval.cumulativeSurvival,
        });
      });
    })),
  }
}

function buildData(props) {
  return Promise.resolve()
    .then(() => {
      const { gene, rawData } = props;

      if(gene) {
        return fetch(`https://dcc.icgc.org/api/v1/analysis/survival/${map[gene] || map.defaultId}`)
          .then(r => r.json())
          .then(geneData => ({ data: [
            processData(geneData.results[0].overall, `${gene}1`),
            processData(geneData.results[1].overall, `${gene}2`),
          ]}));
      }

      return {
        data: [
          processData(rawData, 'project'),
        ]
      };
    });
}

class SurvivalPlotWrapper extends Component {
  constructor(props) {
    super(props);

    this.onDomainChange = this.onDomainChange.bind(this);

    this.state = {
      xDomain: undefined,
      stack: [],
    };
    
    buildData(this.props).then(d => this.setState(d));
  }

  onDomainChange(xDomain) {
    this.setState({
      stack: this.state.stack.concat(this.state.xDomain),
      xDomain,
    });
  }

  resetXDomain() {
    if(this.state.stack.length){
      return {
        stack: [],
        xDomain: this.state.stack[0],
      };
    } else {
      return {};
    }
  }

  reset() {
    this.props.onReset();
  }

  componentWillReceiveProps(nextProps) {
    buildData(nextProps).then(newState => {
      this.setState({
        ...this.resetXDomain(),
        ...newState,
      });
    });
  }

  render() {
    const { xDomain, data,  } = this.state;
    const { height, width } = this.props;

    return (
      <div
        className="survival-plot"
        ref={el => this.container = el}
      >
        <Column>
          <h1 style={styles.heading} id="survival-plot">
            <i className="fa fa-line-chart" style={{ paddingRight: `10px` }} />Survival Plot
          </h1>
          <span style={{textAlign: 'right'}}>
            <Button
              style={styles.button}
              onClick={
                () => {
                  downloadSvg({
                    svg: this.container.querySelector('svg'),
                    stylePrefix: '.survival-plot',
                    fileName: 'survival-plot.svg',
                  });
                }
              }
            >
              <i className="fa fa-download" /><span style={styles.hidden}>reload</span>
            </Button>
            <Button
              style={styles.button}
              onClick={() => this.reset()}
            >
              <i className="fa fa-undo" /><span style={styles.hidden}>reload</span>
            </Button>
          </span>
        </Column>
        {data &&
          <SurvivalPlot
            dataSets={data}
            xDomain={xDomain}
            onDomainChange={this.onDomainChange}
            height={height}
            width={width}
          />
        }
      </div>
    );
  }
}

SurvivalPlotWrapper.defaultProps = {
  onReset: () => {console.log('reset survival plot')},
}

export default SurvivalPlotWrapper;