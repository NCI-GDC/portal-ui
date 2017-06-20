import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';

class GlobalTooltip extends Component {
  componentDidMount() {
    window.addEventListener('mousemove', this.moveTooltip);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.moveTooltip);
  }

  moveTooltip = _.throttle(event => {
    const left = event.pageX;
    const top = event.pageY;
    setTimeout(() => {
      this.globalTooltip.style.left = `${left}px`;
      this.globalTooltip.style.top = `${top -
        this.globalTooltip.offsetHeight -
        15}px`;
    });
  }, 16);

  showTooltip = () => this.setState({ showTootip: true });
  hideTooltip = () => this.setState({ showTootip: false });

  render() {
    return (
      <span
        className="global-tooltip"
        ref={node => (this.globalTooltip = node)}
        style={{
          visibility: this.props.tooltip.Component ? 'visible' : 'hidden',
        }}
      >
        {this.props.tooltip.Component}
      </span>
    );
  }
}

export default connect(state => ({ tooltip: state.tooltip }))(GlobalTooltip);
