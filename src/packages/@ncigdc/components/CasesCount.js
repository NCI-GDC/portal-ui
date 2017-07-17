// @flow

import React from 'react';

type TProps = {
  hits: {
    total: number,
  },
};

const CasesCount = (props: TProps) =>
  <span data-test={props['data-test'] || 'cases-count'}>
    {props.hits.total > 0
      ? props.hits.total.toLocaleString()
      : <span className="fa fa-spinner fa-spin" />}
  </span>;

export default CasesCount;
