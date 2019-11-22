import React from 'react';
import {
  compose,
  withState,
  pure,
  withProps,
} from 'recompose';
import withSize from '@ncigdc/utils/withSize';
import QQPlot from '@oncojs/qqplot';

export default compose(
  withState('chart', 'setState', <span />),
  withProps(({ data }) => ({ data })),
  withSize({ refreshRate: 16 }),
  withProps(({ size: { width } }) => ({ width })),
  withProps(() => ({
    styles: { 
      margin: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
      }
    }
  })),
  pure
)(QQPlot);