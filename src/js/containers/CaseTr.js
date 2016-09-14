import Relay from 'react-relay';
import { tr, td } from 'react-hyperscript-helpers';

const CaseTr = ({ kase }) => (
  tr([
    td(kase.case_id),
    td(kase.project.project_id),
    td(kase.project.primary_site),
    td(kase.demographic.gender),
  ])
);

export default Relay.createContainer(CaseTr, {
  fragments: {
    kase: () => Relay.QL`
      fragment on Case {
        case_id
        project {
          project_id
          primary_site
        }
        demographic {
          gender
        }
      }
    `,
  },
});
