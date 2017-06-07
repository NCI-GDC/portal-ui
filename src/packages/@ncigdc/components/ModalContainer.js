// @flow

import React from 'react';
import { connect } from 'react-redux';
import { setModal } from '@ncigdc/dux/modal';
import Modal from '@ncigdc/uikit/Modal';

const ModalContainer = connect(state => ({
  component: state.modal,
}))(({ component, dispatch }) => (
  <Modal isOpen={!!component} onRequestClose={() => dispatch(setModal(null))}>
    {component}
  </Modal>
));
export default ModalContainer;
