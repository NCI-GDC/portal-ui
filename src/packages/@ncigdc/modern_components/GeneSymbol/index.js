import PropTypes from 'prop-types';
import Component from './GeneSymbol';
import createRenderer from './GeneSymbol.relay';
const GeneSymbol = createRenderer(Component);
GeneSymbol.propTypes = {
  geneId: PropTypes.string,
};
export default GeneSymbol;
