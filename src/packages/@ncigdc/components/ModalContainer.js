// @flow

import React from 'react';
import { connect } from 'react-redux';
import { setModal } from '@ncigdc/dux/modal';
import Modal from '@ncigdc/uikit/Modal';

const ModalContainer = connect(state => ({
  ...state.modal,
}))(({ component, autoClose, dispatch }) =>
  <Modal
    isOpen={!!component}
    onRequestClose={() => autoClose && dispatch(setModal(null))}
  >
    {component}
  </Modal>,
);
export default ModalContainer;
