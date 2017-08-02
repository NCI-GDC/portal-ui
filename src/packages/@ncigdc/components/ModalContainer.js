// @flow

import React from 'react';
import { connect } from 'react-redux';
import { setModal } from '@ncigdc/dux/modal';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Modal from '@ncigdc/uikit/Modal';

const enhance = compose(
  withRouter,
  connect(state => ({
    component: state.modal,
  })),
);

const ModalContainer = ({ component, dispatch, ...props }) =>
  <Modal isOpen={component} {...props} onClose={() => dispatch(setModal(null))}>
    {component}
  </Modal>;

export default enhance(ModalContainer);
