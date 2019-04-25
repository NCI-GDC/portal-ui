// @flow
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import DownloadButton from '@ncigdc/components/DownloadButton';
import { userCanDownloadFile } from '@ncigdc/utils/auth';
import { setModal } from '@ncigdc/dux/modal';
import NoAccessModal from '@ncigdc/components/Modals/NoAccessModal';
import CheckBoxModal from '@ncigdc/components/Modals/CheckBoxModal';
import BaseModal from '@ncigdc/components/Modals/BaseModal';
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
  if (file.access === 'open') {
    return (
      <DownloadButton
        activeText={activeText}
        className="test-download-button"
        endpoint="data?annotations=true&related_files=true"
        extraParams={{ ids: file.file_id }}
        filename={file.file_name}
        inactiveText={inactiveText}
        style={style} />
    );
  }
  return (
    <Button
      className="test-download-button"
      leftIcon={inactiveText && <i className="fa fa-download" />}
      onClick={() => dispatch(
        setModal(
            user ? (
              userCanDownloadFile({
                user,
                file,
              }) ? (
                <CheckBoxModal
                  CustomButton={agreed => (
                    <DownloadButton
                      activeText="Processing"
                      className="test-download-button"
                      disabled={!agreed}
                      endpoint="data?annotations=true&related_files=true"
                      extraParams={{ ids: file.file_id }}
                      filename={file.file_name}
                      inactiveText="Download"
                      setModal={() => dispatch(setModal(null))}
                      style={{ marginLeft: '0.2rem' }} />
                  )}
                  dbGapList={file.acl}
                  dispatch={dispatch} />
              ) : (
                <BaseModal closeText="close" title="Access Alert">
                  <p>
                    You are attempting to download files that you are not
                    authorized to access. Please request dbGaP Access to the
                    project (
                    <a
                      href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
                      target="_blank">
                      click here for more information
                    </a>
).
                  </p>
                </BaseModal>
              )
            ) : (
              <NoAccessModal message="You don't have access to this file." />
            )
        )
      )}
      style={{
        flex: 'none',
        marginLeft: '0.2rem',
        ...style,
      }}>
      {inactiveText || (
        <span>
          <i className="fa fa-download" />
          <Hidden>Download</Hidden>
        </span>
      )}
    </Button>
  );
}

export default compose(connect(state => ({
  ...state.auth,
  ...state.cart,
})))(
  DownloadFile
);
