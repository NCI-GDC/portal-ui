import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';

const PADDING = 20;
let windowWidth = window.innerWidth;
window.addEventListener(
  'resize',
  _.debounce(() => {
    windowWidth = window.innerWidth;
  }, 300),
);

class GlobalTooltip extends Component {
  componentDidMount() {
    window.addEventListener('mousemove', this.moveTooltip);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.moveTooltip);
  }

  moveTooltip = _.throttle(event => {
    this.globalTooltip.style.transform = `translate(${event.pageX}px, ${event.pageY}px)`;

    // shift tooltip if it is off screen.
    const minDistanceFromEdge = this.wrapper.offsetWidth / 2 + PADDING;
    const offset =
      Math.max(minDistanceFromEdge - event.pageX, 0) ||
      Math.min(windowWidth - event.pageX - minDistanceFromEdge, 0);
    this.wrapper.style.transform = `translate(${offset}px, -100%)`;

    // move point so it still points at the mouse
    this.point1.style.transform = `translateX(${-1 * offset}px)`;
    this.point2.style.transform = `translateX(${-1 * offset}px)`;
  }, 16);

  showTooltip = () => this.setState({ showTootip: true });

  hideTooltip = () => this.setState({ showTootip: false });

  render() {
    return (
      <div
        className="global-tooltip"
        ref={node => (this.globalTooltip = node)}
        style={{
          visibility: this.props.tooltip.Component ? 'visible' : 'hidden',
        }}>
        <div className="wrapper" ref={node => (this.wrapper = node)}>
          {this.props.tooltip.Component}
          <div className="point1" ref={node => (this.point1 = node)} />
          <div className="point2" ref={node => (this.point2 = node)} />
        </div>
      </div>
    );
  }
}

export default connect(state => ({ tooltip: state.tooltip }))(GlobalTooltip);
