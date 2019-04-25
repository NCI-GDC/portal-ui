import React from 'react';
import AnnotationLink from './AnnotationLink';
import AnnotationsLink from './AnnotationsLink';

export const AnnotationCountLink = ({ hits, filters }) => {
  if (hits.total > 1) {
    return (
      <AnnotationsLink query={{ filters }}>
        {hits.total.toLocaleString()}
      </AnnotationsLink>
    );
  } if (hits.total === 1) {
    const uuid = hits.edges[0].node.annotation_id;
    return <AnnotationLink uuid={uuid}>1</AnnotationLink>;
  }
  return <span>0</span>;
};
