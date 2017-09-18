import React from 'react';
import { isEqual } from 'lodash';
import { compose, lifecycle, withState } from 'recompose';

import UnstyledButton from '@ncigdc/uikit/UnstyledButton';
import { CaretIcon } from '@ncigdc/theme/icons';
import withRouter from '@ncigdc/utils/withRouter';

const enhance = compose(
  withRouter,
  lifecycle({
    shouldComponentUpdate(nextProps) {
      return ['unmatched', 'matched', 'query'].some(
        key => !isEqual(nextProps[key], this.props[key]),
      );
    },
  }),
  withState('showTable', 'setShowTable', true),
);

export default () => Component =>
  enhance(props => {
    return (
      !!(props.matched.length || props.unmatched.length) && (
        <div style={{ marginTop: '2rem' }}>
          <UnstyledButton
            onClick={e => props.setShowTable(s => !s)}
            style={{ textDecoration: 'underline' }}
          >
            Summary Table ({props.matched.length} matched,{' '}
            {props.unmatched.length} unmatched){' '}
            <CaretIcon direction={props.showTable ? 'down' : 'left'} />
          </UnstyledButton>
          {props.showTable && <Component {...props} />}
        </div>
      )
    );
  });
