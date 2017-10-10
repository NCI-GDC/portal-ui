import PropTypes from 'prop-types';
import Component from './BiospecimenCard';
import createRenderer from './BiospecimenCard.relay';

export const entityTypes = [
  { s: 'sample', p: 'samples' },
  { s: 'portion', p: 'portions' },
  { s: 'aliquot', p: 'aliquots' },
  { s: 'analyte', p: 'analytes' },
  { s: 'slide', p: 'slides' },
];

const BiospecimenCard = createRenderer(Component);
BiospecimenCard.propTypes = {
  caseId: PropTypes.string,
};
export default BiospecimenCard;
