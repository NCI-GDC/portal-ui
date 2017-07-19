/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import { compose, withState } from 'recompose';

import SuggestionFacet from '@ncigdc/components/Aggregations/SuggestionFacet';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';

import type { TBucket } from '@ncigdc/components/Aggregations/types';

import { Row } from '@ncigdc/uikit/Flex';
import { withTheme } from '@ncigdc/theme';
import AnnotationIcon from '@ncigdc/theme/icons/AnnotationIcon';

export type TProps = {
  annotationIdCollapsed: boolean,
  setAnnotationIdCollapsed: Function,
  aggregations: {
    category: { buckets: [TBucket] },
    classification: { buckets: [TBucket] },
    entity_type: { buckets: [TBucket] },
    project__primary_site: { buckets: [TBucket] },
    project__program__name: { buckets: [TBucket] },
    project__project_id: { buckets: [TBucket] },
    status: { buckets: [TBucket] },
  },
  setAutocomplete: () => {},
  suggestions: Array<Object>,
  theme: Object,
};

const annotationFacets = [
  {
    title: 'Entity ID',
    field: 'entity_id',
    full: 'annotations.entity_id',
    doc_type: 'annotations',
    type: 'exact',
  },
  {
    title: 'Case UUID',
    field: 'case_id',
    full: 'annotations.case_id',
    doc_type: 'annotations',
    type: 'exact',
  },
  {
    title: 'Primary Site',
    field: 'project.primary_site',
    full: 'annotations.project.primary_site',
    doc_type: 'annotations',
    type: 'keyword',
  },
  {
    title: 'Project',
    field: 'project.project_id',
    full: 'annotations.project.project_id',
    doc_type: 'annotations',
    type: 'terms',
  },
  {
    title: 'Entity Type',
    field: 'entity_type',
    full: 'annotations.entity_type',
    doc_type: 'annotations',
    type: 'keyword',
  },
  {
    title: 'Annotation Category',
    field: 'category',
    full: 'annotations.category',
    doc_type: 'annotations',
    type: 'keyword',
  },
  {
    title: 'Annotation Created',
    field: 'created_datetime',
    full: 'annotations.created_datetime',
    doc_type: 'annotations',
    type: 'date',
  },
  {
    title: 'Annotation Classification',
    field: 'classification',
    full: 'annotations.classification',
    doc_type: 'annotations',
    type: 'keyword',
  },
];

export const AnnotationAggregationsComponent = compose(
  withState('annotationIdCollapsed', 'setAnnotationIdCollapsed', false),
)((props: TProps) =>
  <div className="test-annotation-aggregations">
    <FacetHeader
      title="Annotation ID"
      field="annotations.annotation_id"
      collapsed={props.annotationIdCollapsed}
      setCollapsed={props.setAnnotationIdCollapsed}
    />
    <SuggestionFacet
      title={'Annotation ID'}
      collapsed={props.annotationIdCollapsed}
      placeholder="Search for Annotation ID"
      hits={props.suggestions}
      setAutocomplete={props.setAutocomplete}
      doctype="annotations"
      fieldNoDoctype="annotation_id"
      style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
      dropdownItem={x =>
        <Row>
          <AnnotationIcon style={{ paddingRight: '1rem' }} />
          {x.annotation_id}
        </Row>}
    />
    {annotationFacets.map(facet =>
      <FacetWrapper
        key={facet.full}
        facet={facet}
        title={facet.title}
        aggregation={props.aggregations[escapeForRelay(facet.field)]}
        relay={props.relay}
        additionalProps={facet.additionalProps}
        style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
      />,
    )}
  </div>,
);

export const AnnotationAggregationsQuery = {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on AnnotationAggregations {
        category {
          buckets {
            doc_count
            key
          }
        }
        classification {
          buckets {
            doc_count
            key
          }
        }
        entity_type {
          buckets {
            doc_count
            key
          }
        }
        project__primary_site {
          buckets {
            doc_count
            key
          }
        }
        project__program__name {
          buckets {
            doc_count
            key
          }
        }
        project__project_id {
          buckets {
            doc_count
            key
          }
        }
        status {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
};

const AnnotationAggregations = Relay.createContainer(
  withTheme(AnnotationAggregationsComponent),
  AnnotationAggregationsQuery,
);

export default AnnotationAggregations;
