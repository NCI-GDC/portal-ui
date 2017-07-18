// @flow

// Vendor
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, pure } from 'recompose';
import CutleryIcon from '@ncigdc/theme/icons/Cutlery';
import Spinner from '@ncigdc/theme/icons/Spinner';

// Custom
import Button from '@ncigdc/uikit/Button';
import styled from '@ncigdc/theme/styled';
import { setModal } from '@ncigdc/dux/modal';
import BAMModal from '@ncigdc/components/Modals/BAMModal';
import NoAccessModal from '@ncigdc/components/Modals/NoAccessModal';
import { userCanDownloadFile } from '@ncigdc/utils/auth';

const BAMButton = styled(Button, {
  marginLeft: '0.5rem',
});

const enhance = compose(withState('active', 'setActive', false), pure);

type TProps = {
  file: Object,
  user: Object,
  dispatch: Function,
  setActive: Function,
  active: boolean,
};

const BAMSlicingButton = ({
  file,
  user,
  dispatch,
  setActive,
  active,
}: TProps) =>
  <BAMButton
    className="test-bam-button"
    style={{ marginLeft: '0.5rem' }}
    leftIcon={active ? <Spinner /> : <CutleryIcon />}
    disabled={active}
    onClick={() =>
      dispatch(
        setModal(
          user && userCanDownloadFile({ user, file })
            ? <BAMModal
                className="test-bam-modal"
                file={file}
                closeModal={() => dispatch(setModal(null))}
                setActive={setActive}
              />
            : <NoAccessModal />,
        ),
      )}
  >
    {active ? 'Slicing' : 'BAM Slicing'}
  </BAMButton>;

export default enhance(
  connect(state => ({
    user: state.auth.user,
  }))(BAMSlicingButton),
);
