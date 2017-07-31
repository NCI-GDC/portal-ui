import PropTypes from 'prop-types';
import Component from './CaseSummary';
import createRenderer from './CaseSummary.relay';
const CaseSummary = createRenderer(Component);
CaseSummary.propTypes = {
  caseId: PropTypes.string,
};
export default CaseSummary;
