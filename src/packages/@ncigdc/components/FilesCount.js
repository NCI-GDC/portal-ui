// @flow

import React from 'react';

type TProps = {
  hits: {
    total: number,
  },
};

const FilesCount = (props: TProps) => (
  <span className={props.className + ' test-files-count'}>
    {props.hits && props.hits.total > 0 ? (
      props.hits.total.toLocaleString()
    ) : (
      <span className="fa fa-spinner fa-spin" />
    )}
  </span>
);

export default FilesCount;
