// @flow
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import DownloadButton from '@ncigdc/components/DownloadButton';
import { userCanDownloadFile } from '@ncigdc/utils/auth';
import { setModal } from '@ncigdc/dux/modal';
import NoAccessModal from '@ncigdc/components/Modals/NoAccessModal';
import CheckBoxModal from '@ncigdc/components/Modals/CheckBoxModal';
import Hidden from '@ncigdc/components/Hidden';
import Button from '@ncigdc/uikit/Button';

type TProps = {
  user: Object,
  file: Object,
  dispatch: Function,
  activeText?: string,
  inactiveText?: string,
  style?: Object,
};

function DownloadFile({
  user,
  file,
  dispatch,
  activeText,
  inactiveText,
  style = {},
}: TProps): any {
  return (
    <Button
      className="test-download-button"
      style={{ flex: 'none', marginLeft: '0.2rem', ...style }}
      onClick={() =>
        dispatch(
          setModal(
            userCanDownloadFile({ user, file }) || true ? (
              <CheckBoxModal
                dbGapList={file.acl}
                single={true}
                CustomButton={agreed => (
                  <DownloadButton
                    disabled={!agreed}
                    className="test-download-button"
                    extraParams={{ ids: file.file_id }}
                    filename={file.file_name}
                    endpoint="data?annotations=true&related_files=true"
                    activeText={activeText}
                    inactiveText={inactiveText}
                    style={style}
                  />
                )}
                dispatch={dispatch}
              />
            ) : (
              <NoAccessModal message="You don't have access to this file." />
            ),
          ),
        )}
      leftIcon={inactiveText && <i className={'fa fa-download'} />}
    >
      {inactiveText || (
        <span>
          <i className={'fa fa-download'} />
          <Hidden>Download</Hidden>
        </span>
      )}
    </Button>
  );
}

export default compose(connect(state => ({ ...state.auth, ...state.cart })))(
  DownloadFile,
);
