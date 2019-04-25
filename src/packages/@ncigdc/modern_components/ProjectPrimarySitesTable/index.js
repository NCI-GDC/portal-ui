import PropTypes from 'prop-types';
import Component from './ProjectPrimarySitesTable';
import createRenderer from './ProjectPrimarySitesTable.relay';

const ProjectPrimarySitesTable = createRenderer(Component);
ProjectPrimarySitesTable.propTypes = {
  projectId: PropTypes.string,
};
export default ProjectPrimarySitesTable;
