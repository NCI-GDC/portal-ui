import Relay from 'react-relay';
import { div } from 'react-hyperscript-helpers';

export const FilePage = props => {
  console.log('FilePage', props);
  return div([
    div(props.node.file_id),
    div(props.node.file_name),
    div(props.node.file_size),
    div(props.node.access),
    div(props.node.data_category),
    div(props.node.data_format),
    div(`${[...new Set(props.node.cases.map(c => c.project.project_id))]}`),
    div(props.node.platform),
  ]);
};

export default Relay.createContainer(FilePage, {
  fragments: {
    node: () => Relay.QL`
      fragment on File {
        file_id
        file_name
        file_size
        access
        data_category
        data_format
        cases {
          project {
            project_id
          }
        }
        platform
      }
    `,
  },
});
