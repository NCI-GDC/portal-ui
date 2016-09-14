import Relay from 'react-relay';
import { tr, td, h } from 'react-hyperscript-helpers';
import { Link } from 'react-router';

const AnnotationTr = ({ node }) => (
  tr([
    td([
      h(Link, {
        to: {
          pathname: `/annotations/${node.annotation_id}`,
        },
      }, node.annotation_id),
    ]),
    td(node.case_id),
    td(node.project.project_id),
    td(node.entity_type),
    td(node.entity_id),
    td(node.category),
    td(node.classification),
    td(node.created_datetime),
  ])
);

export default Relay.createContainer(AnnotationTr, {
  fragments: {
    node: () => Relay.QL`
      fragment on Annotation {
        annotation_id
        case_id
        project {
          project_id
        }
        entity_type
        entity_id
        category
        classification
        created_datetime
      }
    `,
  },
});
