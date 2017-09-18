/* @flow */
import React from 'react';
import { compose, withState, withHandlers } from 'recompose';

import Spinner from '@ncigdc/theme/icons/Spinner';
import DownloadIcon from '@ncigdc/theme/icons/Download';
import Button from '@ncigdc/uikit/Button';

export default compose(
  withState('spinning', 'setSpinning', false),
  withHandlers({
    onClick: ({ onClick, setSpinning }) => async event => {
      setSpinning(true);
      await onClick();
      setSpinning(false);
    },
  }),
)(({ spinning, setSpinning, children, ...props }) => (
  <Button leftIcon={spinning ? <Spinner /> : <DownloadIcon />} {...props}>
    {children}
  </Button>
));
