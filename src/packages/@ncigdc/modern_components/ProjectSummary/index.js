import PropTypes from 'prop-types';
import Component from './ProjectSummary';
import createRenderer from './ProjectSummary.relay';

const ProjectSummary = createRenderer(Component);
ProjectSummary.propTypes = {
  projectId: PropTypes.string,
};
export default ProjectSummary;
