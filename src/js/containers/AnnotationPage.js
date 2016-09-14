import Relay from 'react-relay';
import { div } from 'react-hyperscript-helpers';

export const AnnotationPage = props => {
  console.log('AnnotationPage', props);
  return div([
    div(props.node.annotation_id),
    div(props.node.entity_id),
    div(props.node.entity_submitter_id),
    div(props.node.entity_type),
    div(props.node.case_id),
    div(props.node.project.project_id),
    div(props.node.classification),
    div(props.node.category),
    div(props.node.created_datetime),
    div(props.node.status),
    div(props.node.notes),
  ]);
};

export default Relay.createContainer(AnnotationPage, {
  fragments: {
    node: () => Relay.QL`
      fragment on Annotation {
        annotation_id
        entity_id
        entity_submitter_id
        entity_type
        case_id
        project {
          project_id
        }
        classification
        category
        created_datetime
        status
        notes
      }
    `,
  },
});
