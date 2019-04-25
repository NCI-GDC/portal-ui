import PropTypes from 'prop-types';
import Component from './CaseSymbol';
import createRenderer from './CaseSymbol.relay';
const CaseSymbol = createRenderer(Component);
CaseSymbol.propTypes = {
  caseId: PropTypes.string,
};
export default CaseSymbol;
