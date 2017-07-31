import PropTypes from 'prop-types';
import Component from './BiospecimenCard';
import createRenderer from './BiospecimenCard.relay';
const BiospecimenCard = createRenderer(Component);
BiospecimenCard.propTypes = {
  caseId: PropTypes.string,
};
export default BiospecimenCard;
