import PropTypes from 'prop-types';
import Component from './CasesByPrimarySite';
import withData from './CasesByPrimarySite.relay';
const CasesByPrimarySite = withData(Component);
CasesByPrimarySite.propTypes = {
  projectId: PropTypes.string,
};
export default CasesByPrimarySite;
