import PropTypes from 'prop-types';
import Component from './ClinicalCard';
import createRenderer from './ClinicalCard.relay';

const ClinicalCard = createRenderer(Component);
ClinicalCard.propTypes = {
  caseId: PropTypes.string,
};
export default ClinicalCard;
