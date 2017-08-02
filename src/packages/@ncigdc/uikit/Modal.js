// @flow

import React from 'react';

import './Modal.css';

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: '0px',
    left: '0px',
    right: '0px',
    bottom: '0px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'block',
    zIndex: '111',
  },
  content: {
    position: 'initial',
    border: '1px solid rgb(204, 204, 204)',
    background: 'rgb(255, 255, 255)',
    borderRadius: '4px',
    margin: '30px auto',
    padding: '0px',
    width: '65%',
    boxShadow: 'rgba(0, 0, 0, 0.5) 0px 5px 15px',
  },
};

const openClassName = 'modal-open';
function updateOpenClass(condition) {
  if (condition) {
    document.body.classList.add(openClassName);
  } else {
    document.body.classList.remove(openClassName);
  }
}

export default class ModalContainer extends React.Component {
  componentDidMount() {
    updateOpenClass(this.props.isOpen);
  }
  componentWillReceiveProps(nextProps) {
    updateOpenClass(nextProps.isOpen);
  }
  componentWillUnmount() {
    updateOpenClass(true);
  }
  render() {
    const { className, children, onClose, style = {}, isOpen } = this.props;

    return (
      isOpen &&
      <div
        className={`${className || ''} test-modal`}
        style={{ ...modalStyles.overlay, ...style.overlay }}
        onClick={onClose}
      >
        <div
          style={{ ...modalStyles.content, ...style.content }}
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    );
  }
}
