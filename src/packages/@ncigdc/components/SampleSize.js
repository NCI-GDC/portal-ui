import React from 'react';
import { css } from 'glamor';

const styles = {
  deemphasizedHeading: {
    fontWeight: 'bold',
    letterSpacing: -0.5,
    fontSize: '0.8em',
    opacity: 0.8,
    color: '#3a3a3a',
  },
};

export default ({
  n,
  style,
  formatter = x => x.toLocaleString(),
  symbol = 'n',
}) =>
  <span
    {...css({ ...styles.deemphasizedHeading, ...style })}
    className="test-sample-size"
  >
    <small>( </small> {symbol}=
    {n ? formatter(n) : `--`}
    <small> )</small>
  </span>;
