// @flow

import React from "react";

type TProps = {
  hits: {
    total: number
  }
};

const ProjectsCount = (props: TProps) => (
  <span>
    {props.hits.total > 0
      ? props.hits.total.toLocaleString()
      : <span className="fa fa-spinner fa-spin" />}
  </span>
);

export default ProjectsCount;
