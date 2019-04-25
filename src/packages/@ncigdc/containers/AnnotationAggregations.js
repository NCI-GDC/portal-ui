/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import { compose, withState } from 'recompose';

import SuggestionFacet from '@ncigdc/components/Aggregations/SuggestionFacet';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';

import { IBucket } from '@ncigdc/components/Aggregations/types';

import { Row } from '@ncigdc/uikit/Flex';
import { withTheme } from '@ncigdc/theme';
import AnnotationIcon from '@ncigdc/theme/icons/AnnotationIcon';

export type TProps = {
  annotationIdCollapsed: boolean,
  setAnnotationIdCollapsed: Function,
  aggregations: {
    category: { buckets: [IBucket] },
    classification: { buckets: [IBucket] },
    entity_type: { buckets: [IBucket] },
    project__primary_site: { buckets: [IBucket] },
    project__program__name: { buckets: [IBucket] },
    project__project_id: { buckets: [IBucket] },
    status: { buckets: [IBucket] },
  },
  setAutocomplete: () => {},
  suggestions: Array<Object>,
  theme: Object,
};

const annotationFacets = [
  {
    title: 'Entity UUID',
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
)((props: TProps) => (
  <div className="test-annotation-aggregations">
    <FacetHeader
      collapsed={props.annotationIdCollapsed}
      field="annotations.annotation_id"
      setCollapsed={props.setAnnotationIdCollapsed}
      title="Annotation UUID" />
    <SuggestionFacet
      collapsed={props.annotationIdCollapsed}
      doctype="annotations"
      dropdownItem={x => (
        <Row>
          <AnnotationIcon style={{ paddingRight: '1rem' }} />
          {x.annotation_id}
        </Row>
      )}
      fieldNoDoctype="annotation_id"
      hits={props.suggestions}
      placeholder="Search for Annotation UUID"
      setAutocomplete={props.setAutocomplete}
      style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
      title="Annotation ID" />
    {annotationFacets.map(facet => (
      <FacetWrapper
        additionalProps={facet.additionalProps}
        aggregation={props.aggregations[escapeForRelay(facet.field)]}
        facet={facet}
        key={facet.full}
        relay={props.relay}
        style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
        title={facet.title} />
    ))}
  </div>
));

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
