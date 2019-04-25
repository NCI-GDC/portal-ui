import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import queryString from 'query-string';
import withRouter from '../utils/withRouter';
import Link from './Links/Link';
import UnstyledButton from '../uikit/UnstyledButton';
import { addAnalysis } from '../dux/analysis';

const enhance = compose(connect(({ analysis }) => ({ analysis })), withRouter);

const CreateOrOpenAnalysis = ({
  dispatch,
  push,
  analysis,
  sets,
  type,
  children,
  style,
  ...props
}) => {
  const existing = (analysis.saved || [])
    .filter(s => s.type === type)
    .find(saved => {
      return saved.type === type && isEqual(saved.sets, sets);
    });

  return existing ? (
    <Link
      query={{
        analysisTableTab: 'result',
        analysisId: existing.id,
      }}
      style={style}
      target="_BLANK">
      {children}
    </Link>
  ) : (
    <UnstyledButton
      onClick={() => {
        const created = new Date().toISOString();
        const id = created;

        dispatch(
          addAnalysis({
            id,
            sets,
            type,
            created,
          }),
        ).then(() => {
          window.open(
            `analysis?${queryString.stringify({
              analysisTableTab: 'result',
              analysisId: id,
            })}`,
          );
        });
      }}
      style={style}>
      {children}
    </UnstyledButton>
  );
};

export default enhance(CreateOrOpenAnalysis);
