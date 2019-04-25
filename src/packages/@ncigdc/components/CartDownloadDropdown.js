// @flow
/* eslint react/no-unescaped-entities: 0 */

import React from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import urlJoin from 'url-join';

import { authPartitionFiles } from '@ncigdc/utils/auth';
import DownloadButton from '@ncigdc/components/DownloadButton';
import BaseModal from '@ncigdc/components/Modals/BaseModal';
import CheckBoxModal from '@ncigdc/components/Modals/CheckBoxModal';
import LoginButton from '@ncigdc/components/LoginButton';

import DownCaretIcon from 'react-icons/lib/fa/caret-down';

import { setModal } from '@ncigdc/dux/modal';

import Dropdown from '@ncigdc/uikit/Dropdown';
import Button from '@ncigdc/uikit/Button';
import { Column, Row } from '@ncigdc/uikit/Flex';
import { ExternalLink } from '@ncigdc/uikit/Links';

import { withTheme } from '@ncigdc/theme';
import DownloadIcon from '@ncigdc/theme/icons/Download';
import Spinner from '@ncigdc/theme/icons/Spinner';

import download from '@ncigdc/utils/download';
import { AUTH_API } from '@ncigdc/utils/constants';
/*----------------------------------------------------------------------------*/

const styles = {
  common: theme => ({
    backgroundColor: 'transparent',
    color: theme.greyScale2,
    justifyContent: 'flex-start',
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  }),
  button: theme => ({
    borderRadius: '0px',
    marginLeft: '0px',
    ...styles.common(theme),
    '[disabled]': styles.common(theme),
  }),
  iconSpacing: {
    marginRight: '0.6rem',
  },
};

const downloadCart = ({
  user,
  files,
  dispatch,
  disableAgreement = false,
  setState,
}: {
  user: Object,
  files: Array<Object>,
  dispatch: Function,
  disableAgreement: boolean,
  setState: Function,
}) => {
  const { authorized, unauthorized } = authPartitionFiles({
    user,
    files,
  });

  const dbGapList = Array.from(
    new Set(
      authorized.files
        .concat(unauthorized.files)
        .reduce((acc, f) => acc.concat(f.acl), [])
        .filter(f => f !== 'open')
    )
  );
  if (disableAgreement || dbGapList.length === 0) {
    dispatch(setModal(null));
    setState(s => ({
      ...s,
      cartDownloading: true,
    }));
    download({
      url: urlJoin(AUTH_API, 'data'),
      params: {
        ids: files.map(file => file.file_id),
        annotations: true,
        related_files: true,
      },
      method: 'POST',
      altMessage: true,
    })(() => {}, () => setState(s => ({
      ...s,
      cartDownloading: false,
    })));
  } else if (
    authorized.files.reduce((sum, x) => sum + x.file_size, 0) >
    5 * 10e8
  ) {
    dispatch(
      setModal(
        <BaseModal title="Cart size limit">
          <p>Your cart contains more than 5GBs of data.</p>
          <p>
            Please select the "Download &gt; Manifest" option and use the&nbsp;
            <ExternalLink
              hasExternalIcon={false}
              href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
              title="GDC Data Transfer Tool">
              Data Transfer Tool
            </ExternalLink>
            {' '}
            Tool to continue.
          </p>
        </BaseModal>
      )
    );
  } else if (unauthorized.doc_count > 0) {
    dispatch(
      setModal(
        <CheckBoxModal
          closeText="Cancel"
          CustomButton={agreed => (
            <Button
              disabled={!authorized.doc_count || (!!user && !agreed)}
              onClick={() => downloadCart({
                user,
                files: authorized.files,
                disableAgreement: true,
                dispatch,
                setState,
              })}
              style={{ margin: '0 10px' }}>
              Download
              {' '}
              {authorized.doc_count}
              {' '}
Authorized Files
            </Button>
          )}
          dbGapList={dbGapList}
          dispatch={dispatch}
          hidden={!user || authorized.doc_count === 0}>
          <div>
            <p>
              You are attempting to download files that you are not authorized
              to access.
            </p>
            <p>
              <span className="label label-success">
                {authorized.doc_count}
              </span>
              {' '}
              files that you are authorized to download.
            </p>
            <p>
              <span className="label label-danger">
                {unauthorized.doc_count}
              </span>
              {' '}
              files that you are not authorized to download.
            </p>
          </div>
          {user ? (
            <p>
              Please request dbGaP Access to the project (
              <a
                href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
                target="_blank">
                click here for more information
              </a>
).
            </p>
          ) : (
            <p>
              Please
              {' '}
              <LoginButton />
            </p>
          )}
        </CheckBoxModal>
      )
    );
  } else {
    dispatch(
      setModal(
        <CheckBoxModal
          CustomButton={agreed => (
            <Button
              disabled={!agreed}
              onClick={() => {
                setState(s => ({
                  ...s,
                  cartDownloading: true,
                }));
                download({
                  url: urlJoin(AUTH_API, 'data'),
                  params: {
                    ids: files.map(file => file.file_id),
                    annotations: true,
                    related_files: true,
                  },
                  method: 'POST',
                  altMessage: true,
                })(
                  () => {},
                  () => setState(s => ({
                    ...s,
                    cartDownloading: false,
                  }))
                );
              }}
              style={{ margin: '0 10px' }}>
              Download
              {' '}
              {authorized.doc_count}
              {' '}
Authorized Files
            </Button>
          )}
          dbGapList={dbGapList}
          dispatch={dispatch} />
      )
    );
  }
};

const CartDownloadDropdown = ({
  user,
  files,
  theme,
  disabled = false,
  state,
  setState,
  dispatch,
}) => (
  <Row>
    <Dropdown
      button={(
        <Button
          leftIcon={
            state.manifestDownloading || state.cartDownloading ? (
              <Spinner />
            ) : (
              <DownloadIcon />
            )
          }
          rightIcon={<DownCaretIcon />}
          style={{ marginLeft: '1em' }}>
          Download
        </Button>
      )}
      className="test-cart-download-dropdown"
      dropdownItemClass={false}
      dropdownStyle={{
        marginTop: '2px',
        borderRadius: '4px',
      }}>
      <Column>
        <DownloadButton
          active={state.manifestDownloading}
          activeText="Manifest"
          altMessage={false}
          className="test-download-manifest"
          endpoint="manifest"
          extraParams={{
            ids: files.map(file => file.file_id),
          }}
          inactiveText="Manifest"
          setParentState={currentState => setState(s => ({
            ...s,
            manifestDownloading: currentState,
          }))}
          size={files.length}
          style={styles.button(theme)} />
        <Button
          className="test-download-cart"
          disabled={state.cartDownloading}
          leftIcon={state.cartDownloading ? <Spinner /> : <DownloadIcon />}
          onClick={() => downloadCart({
            user,
            files,
            dispatch,
            disableAgreement: false,
            setState,
          })}
          style={styles.button(theme)}>
          Cart
        </Button>
      </Column>
    </Dropdown>
  </Row>
);

export default compose(
  connect(),
  withTheme,
  withState('state', 'setState', {
    manifestDownloading: false,
    cartDownloading: false,
  })
)(CartDownloadDropdown);
