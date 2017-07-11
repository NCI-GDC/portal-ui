import PropTypes from 'prop-types';
import Component from './GeneExternalReferences';
import createRenderer from './GeneExternalReferences.relay';
const GeneExternalReferences = createRenderer(Component);
GeneExternalReferences.propTypes = {
  geneId: PropTypes.string,
};
export default GeneExternalReferences;
