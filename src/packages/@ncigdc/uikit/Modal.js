// @flow

import React, { Children, cloneElement } from 'react';
import {
  compose,
  withState,
} from 'recompose';
import _ from 'lodash';
import ReactModal from 'react-modal';
import { Rnd } from 'react-rnd';
import './Modal.css';

ReactModal.setAppElement('#root');

const modalStyles = {
  content: {
    background: 'rgb(255, 255, 255)',
    border: '1px solid rgb(204, 204, 204)',
    borderRadius: '4px',
    boxShadow: 'rgba(0, 0, 0, 0.5) 0px 5px 15px',
    margin: '30px auto',
    minHeight: '650px',
    padding: '0px',
    position: 'initial',
    width: '55%',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: '0px',
    display: 'block',
    left: '0px',
    position: 'fixed',
    right: '0px',
    top: '0px',
    zIndex: '111',
  },
};

const Modal = ({
  children,
  enableDragging,
  isOpen,
  onRequestClose,
  pos,
  setPos,
  style,
}) => {
  if (!children) {
    return null;
  }
  return (
    <Rnd
      disableDragging={!enableDragging}
      onDrag={(e, d) => {
        if (e.path.length > 7) {
          setPos({
            ...pos,
            x: d.x,
            y: d.y,
          });
        }
      }}
      onResize={(e, direction, ref, delta, position) => {
        setPos({
          height: ref.style.height,
          width: ref.style.width,
          ...position,
        });
      }}
      position={{
        x: pos.x,
        y: pos.y,
      }}
      size={{
        height: pos.height,
        width: pos.width,
      }}
      >
      <ReactModal
        className="test-modal"
        contentLabel="Modal"
        isOpen={isOpen}
        onRequestClose={onRequestClose || (() => { })}
        shouldCloseOnOverlayClick
        style={{
          ..._.merge({}, modalStyles, style, {
            content: {
              height: pos.height,
              transform: `translate(${pos.x}px, ${pos.y}px)`,
              width: pos.width,
            },
          }),
        }}
        >
        {Children.map(children, child => cloneElement(child, { ...child.props }))}
      </ReactModal>
    </Rnd>
  );
};

export default compose(
  withState('pos', 'setPos', {
    height: '65%',
    width: '55%',
    x: 0,
    y: 0,
  }),
)(Modal);
