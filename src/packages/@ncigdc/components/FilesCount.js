// @flow

import React from 'react';

type TProps = {
  hits: {
    total: number,
  },
};

const FilesCount = (props: TProps) =>
  <span data-test={props['data-test'] || 'files-count'}>
    {props.hits.total > 0
      ? props.hits.total.toLocaleString()
      : <span className="fa fa-spinner fa-spin" />}
  </span>;

export default FilesCount;
