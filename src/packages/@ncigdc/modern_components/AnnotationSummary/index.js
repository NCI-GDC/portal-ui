import PropTypes from 'prop-types';
import Component from './AnnotationSummary';
import withData from './AnnotationSummary.relay';

const AnnotationSummary = withData(Component);
AnnotationSummary.propTypes = {
  annotationId: PropTypes.string,
};
export default AnnotationSummary;
