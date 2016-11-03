import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { renderPlot } from '@oncojs/survivalplot'

function isElementFullScreen (element) {
  return _.includes([
    document.fullscreenElement,
    document.webkitFullscreenElement,
    document.mozFullscreenElement,
    ], element)
}

export class SurvivalPlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xDomain: undefined,
      disabledDataSets: undefined,
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
  }

  componentDidUpdate() {
    this.update()
  }

  componentDidMount () {
    this.update()
  }

  updateState (newState) {
    this.stateStack = this.stateStack.concat(this.state)
    this.setState(newState)
  }

  update (params) {
    var state = this.state
    var container = this._container

    renderPlot(_.defaults({
      container, 
      dataSets: this.props.dataSets,
      disabledDataSets: state.disabledDataSets,
      palette: this.props.palette,
      xDomain: this.props.xDomain,
      xAxisLabel: 'Duration (days)',
      yAxisLabel: 'Survival Rate',
      height: isElementFullScreen(container) ? ( window.innerHeight - 100 ) : (this.props.height || 0),
      getSetSymbol: this.props.getSetSymbol,
      onMouseEnterDonor: this.props.onMouseEnterDonor.bind(this),
      onMouseLeaveDonor: this.props.onMouseLeaveDonor.bind(this),
      onClickDonor: this.props.onClickDonor,
      onDomainChange: this.props.onDomainChange,
      margins: this.props.margins,
    }, params))
  }

  render() {
    return (
      <div
        ref={c => this._container = c}
        className={this.props.className || ''}
      />
    )
  }
}

SurvivalPlot.propTypes = {
  className: PropTypes.string,
  dataSets: PropTypes.array.isRequired,
  palette: PropTypes.array,
  censoredStatuses: PropTypes.array,
  onMouseEnterDonor: PropTypes.func,
  onMouseLeaveDonor: PropTypes.func,
  onClickDonor: PropTypes.func,
  margins: PropTypes.object,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  getSetSymbol: PropTypes.func,
}

SurvivalPlot.defaultProps = {
  palette: ['#0e6402', '#c20127', '#00005d'],
  censoredStatuses: ['alive'],
  margins: {
    top: 20,
    right: 20,
    bottom: 46,
    left: 60,
  },
  onMouseEnterDonor(event, donor) {
    console.log({
      donor: {
        ...donor,
        isCensored: _.includes(this.props.censoredStatuses, donor.status),
      },
    })
  },
  onMouseLeaveDonor () {
    console.log('onMouseLeaveDonor')
  },
  onClickDonor (e, donor) {
    console.log('onClickDonor')
  },
  xAxisLabel: 'Survival Rate',
  yAxisLabel: 'Duration (days)',
};

SurvivalPlot.stateStack = []
