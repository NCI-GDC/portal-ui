// @flow
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import DownloadButton from '@ncigdc/components/DownloadButton';
import { userCanDownloadFile } from '@ncigdc/utils/auth';
import { setModal } from '@ncigdc/dux/modal';
import NoAccessModal from '@ncigdc/components/Modals/NoAccessModal';
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
  if (userCanDownloadFile({ user, file })) {
    return (
      <DownloadButton
        data-test="download-button"
        extraParams={{ ids: file.file_id }}
        filename={file.file_name}
        endpoint="data?annotations=true&related_files=true"
        activeText={activeText}
        inactiveText={inactiveText}
        style={style}
      />
    );
  }

  return (
    <Button
      data-test="download-button"
      style={{ flex: 'none', marginLeft: '0.2rem', ...style }}
      onClick={() =>
        dispatch(
          setModal(
            <NoAccessModal message="You don't have access to this file." />,
          ),
        )}
      leftIcon={inactiveText && <i className={'fa fa-download'} />}
    >
      {inactiveText ||
        <span>
          <i className={'fa fa-download'} /><Hidden>Download</Hidden>
        </span>}
    </Button>
  );
}

export default compose(connect(state => ({ ...state.auth, ...state.cart })))(
  DownloadFile,
);
