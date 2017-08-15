import PropTypes from 'prop-types';
import Component from './FileName';
import withData from './FileName.relay';
const FileName = withData(Component);
FileName.propTypes = {
  fileId: PropTypes.string,
};
export default FileName;
