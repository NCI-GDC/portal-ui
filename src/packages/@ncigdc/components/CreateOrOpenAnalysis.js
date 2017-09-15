import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
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
  ...props
}) => {
  const existing = (analysis.saved || [])
    .filter(s => s.type === type)
    .find(saved => {
      return (
        saved.type === type &&
        Object.keys(saved.sets).length === Object.keys(sets).length &&
        Object.entries(sets).every(([key, ids]) => {
          const savedIds = saved.sets[key] || [];
          return (
            savedIds.length === ids.length &&
            ids.every(s => savedIds.includes(s))
          );
        })
      );
    });

  return existing
    ? <Link
        {...props}
        query={{
          analysisTableTab: 'result',
          analysisId: existing.id,
        }}
      >
        {children}
      </Link>
    : <UnstyledButton
        {...props}
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
            push({
              query: {
                analysisTableTab: 'result',
                analysisId: id,
              },
            });
          });
        }}
      >
        {children}
      </UnstyledButton>;
};

export default enhance(CreateOrOpenAnalysis);
