import Relay from 'react-relay';
import { tr, td, h } from 'react-hyperscript-helpers';
import { Link } from 'react-router';

const FileTr = ({ node }) => (
  tr([
    td(node.access),
    td([
      h(Link, {
        to: {
          pathname: `/files/${node.file_id}`,
        },
      }, node.file_name),
    ]),
    td(`${node.cases.length}`),
    td(`${[...new Set(node.cases.map(c => c.project.project_id))]}`),
    td(node.data_category),
    td(node.data_format),
    td(`${node.file_size}B`),
  ])
);

export default Relay.createContainer(FileTr, {
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
      }
    `,
  },
});
