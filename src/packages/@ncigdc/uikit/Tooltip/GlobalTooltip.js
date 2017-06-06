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

  moveTooltip = event => {
    this.globalTooltip.style.left = `${event.pageX}px`;
    this.globalTooltip.style.top = `${event.pageY - this.globalTooltip.offsetHeight - 15}px`;
  };

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
