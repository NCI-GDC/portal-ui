// @flow

import React, { Children, cloneElement } from 'react';
import _ from 'lodash';
import ReactModal from 'react-modal';

import './Modal.css';

ReactModal.setAppElement('#root');

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: '0px',
    display: 'block',
    left: '0px',
    position: 'fixed',
    right: '0px',
    top: '0px',
    zIndex: '200',
  },
  content: {
    background: 'rgb(255, 255, 255)',
    border: '1px solid rgb(204, 204, 204)',
    borderRadius: '4px',
    boxShadow: 'rgba(0, 0, 0, 0.5) 0px 5px 15px',
    margin: '30px auto',
    maxHeight: 'calc(100% - 60px)',
    maxWidth: '800px',
    overflowY: 'auto',
    padding: '0px',
    position: 'initial',
    width: '90%',
  },
};

const Modal = ({
  children, isOpen, onRequestClose, style,
}) => (
  <ReactModal
      className="test-modal"
      contentLabel="Modal"
      isOpen={isOpen}
      onRequestClose={onRequestClose || (() => { })}
      style={{ ..._.merge({}, modalStyles, style) }}
      >
      {Children.map(children, child => cloneElement(child, { ...child.props }))}
    </ReactModal>
);

export default Modal;
