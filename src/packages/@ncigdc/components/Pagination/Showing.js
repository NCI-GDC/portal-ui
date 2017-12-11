/* @flow */

import React from 'react';

import { Row } from '@ncigdc/uikit/Flex';

export type TProps = {|
  docType: string,
  params: Object,
  prefix?: string,
  total: number,
|};

const Sizes = (props: TProps) => {
  const prfOff = [props.prefix, 'offset'].filter(Boolean).join('_');
  const prfSize = [props.prefix, 'size'].filter(Boolean).join('_');

  const start = props.total ? +props.params[prfOff] + 1 : 0;
  const end = Math.min(
    +props.params[prfOff] + +props.params[prfSize],
    props.total,
  );

  return (
    <Row spacing="0.5rem" className="test-showing">
      <span>Showing</span>
      <strong>{start.toLocaleString()}</strong>
      <span>-</span>
      <strong>{end.toLocaleString()}</strong>
      <span>of</span>
      <strong>{props.total.toLocaleString()}</strong>
      <span>{props.docType}</span>
    </Row>
  );
};

export default Sizes;
