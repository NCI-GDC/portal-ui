import React from 'react';
import { get } from 'lodash';

import GreyBox from '@ncigdc/uikit/GreyBox';

export default ({ repository, loading }) =>
  loading ? (
    <GreyBox style={{ width: '100px' }} />
  ) : (
    get(
      repository,
      'cases.hits.edges[0].node.samples.hits.edges[0].node.sample_type',
      '--',
    )
  );
