// @flow

import React, { Children, cloneElement } from 'react';
import _ from 'lodash';
import ReactModal from 'react-modal';

import './Modal.css';

ReactModal.setAppElement('#root');

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
    width: '55%',
    boxShadow: 'rgba(0, 0, 0, 0.5) 0px 5px 15px',
  },
};

const Modal = ({
 children, isOpen, onRequestClose, style 
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
