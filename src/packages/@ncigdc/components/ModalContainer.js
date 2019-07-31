// @flow

import React from 'react';
import { connect } from 'react-redux';
import { setModal } from '@ncigdc/dux/modal';
import Modal from '@ncigdc/uikit/Modal';

const ModalContainer = connect(
  state => state.modal || {},
)(({
  autoClose,
  component,
  dispatch,
}) => (
  <Modal
    enableDragging={component && component.props.enableDragging}
    isOpen={!!component}
    onRequestClose={() => autoClose && dispatch(setModal(null))}
    style={component && { content: component.props.modalStyle }}
    >
    {component}
  </Modal>
));

export default ModalContainer;
