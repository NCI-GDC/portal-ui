import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';
import PropTypes from 'prop-types';
import createRenderer from './GeneSymbol.relay';

const Component = LoadableWithLoading({
  loader: () => import('./GeneSymbol'),
});

const GeneSymbol = createRenderer(Component);
GeneSymbol.propTypes = {
  geneId: PropTypes.string,
};
export default GeneSymbol;
