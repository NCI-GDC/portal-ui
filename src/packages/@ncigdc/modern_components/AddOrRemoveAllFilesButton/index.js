import PropTypes from 'prop-types';
import Component from './AddOrRemoveAllFilesButton';
import createRendererBtn from './AddOrRemoveAllFilesButton.relay';
import createRendererFilesTotal from './CaseFilesTotal.relay';

const AddOrRemoveAllFilesButton = createRendererFilesTotal(
  createRendererBtn(Component),
);
AddOrRemoveAllFilesButton.propTypes = {
  caseId: PropTypes.string,
};
export default AddOrRemoveAllFilesButton;
