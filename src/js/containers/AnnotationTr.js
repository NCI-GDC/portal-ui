import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

const AnnotationTr = ({ node }) => (
  <tr>
    <td>
      <Link to={{ pathname: `/annotations/${node.annotation_id}` }}>
        {node.annotation_id}
      </Link>
    </td>
    <td>{node.case_id}</td>
    <td>{node.project.project_id}</td>
    <td>{node.entity_type}</td>
    <td>{node.entity_id}</td>
    <td>{node.category}</td>
    <td>{node.classification}</td>
    <td>{node.created_datetime}</td>
  </tr>
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
