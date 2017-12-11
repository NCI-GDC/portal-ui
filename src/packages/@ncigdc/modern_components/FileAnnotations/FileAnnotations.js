/* flow */
import React from 'react';
import { get } from 'lodash';

import GreyBox from '@ncigdc/uikit/GreyBox';
import AnnotationsLink from '@ncigdc/components/Links/AnnotationsLink';
import AnnotationLink from '@ncigdc/components/Links/AnnotationLink';
import { makeFilter } from '@ncigdc/utils/filters';

const getLink = (hits: {
  edges: Array<{ node: { annotation_id: string, entity_id: string } }>,
  total: number,
}) => {
  const { total, edges: annotations } = hits;

  if (total === 0) {
    return 0;
  }

  if (total === 1) {
    return (
      <AnnotationLink uuid={annotations[0].node.annotation_id}>
        {total}
      </AnnotationLink>
    );
  }

  return (
    <AnnotationsLink
      query={{
        filters: makeFilter([
          {
            field: 'annotations.entity_id',
            value: annotations[0].node.entity_id,
          },
        ]),
      }}
    >
      {total}
    </AnnotationsLink>
  );
};

export default ({ repository, loading }) =>
  loading ? (
    <GreyBox />
  ) : (
    getLink(
      get(repository, 'files.hits.edges[0].node.annotations.hits', {
        edges: [],
        total: 0,
      }),
    )
  );
