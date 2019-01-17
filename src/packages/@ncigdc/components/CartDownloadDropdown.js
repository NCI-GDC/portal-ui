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
  const { authorized, unauthorized } = authPartitionFiles({ user, files });

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
    setState(s => ({ ...s, cartDownloading: true }));
    download({
      url: urlJoin(AUTH_API, 'data'),
      params: {
        ids: files.map(file => file.file_id),
        annotations: true,
        related_files: true,
      },
      method: 'POST',
      altMessage: true,
    })(() => {}, () => setState(s => ({ ...s, cartDownloading: false })));
  } else if (unauthorized.doc_count > 0) {
    dispatch(
      setModal(
        <CheckBoxModal
          dbGapList={dbGapList}
          CustomButton={agreed => (
            <Button
              disabled={!authorized.doc_count || (!!user && !agreed)}
              onClick={() =>
                downloadCart({
                  user,
                  files: authorized.files,
                  disableAgreement: true,
                  dispatch,
                  setState,
                })}
              style={{ margin: '0 10px' }}
            >
              Download {authorized.doc_count} Authorized Files
            </Button>
          )}
          hidden={!user || authorized.doc_count === 0}
          closeText="Cancel"
          dispatch={dispatch}
        >
          <div>
            <p>
              You are attempting to download files that you are not authorized
              to access.
            </p>
            <p>
              <span className="label label-success">
                {authorized.doc_count}
              </span>{' '}
              files that you are authorized to download.
            </p>
            <p>
              <span className="label label-danger">
                {unauthorized.doc_count}
              </span>{' '}
              files that you are not authorized to download.
            </p>
          </div>
          {user ? (
            <p>
              Please request dbGaP Access to the project (<a
                target={'_blank'}
                href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
              >
                click here for more information
              </a>).
            </p>
          ) : (
            <p>
              Please <LoginButton />
            </p>
          )}
        </CheckBoxModal>
      )
    );
  } else if (files.reduce((sum, x) => sum + x.file_size, 0) > 5 * 10e8) {
    dispatch(
      setModal(
        <BaseModal title="Cart size limit">
          <p>Your cart contains more than 5GBs of data.</p>
          <p>
            Please select the "Download &gt; Manifest" option and use the&nbsp;
            <ExternalLink
              hasExternalIcon={false}
              title="GDC Data Transfer Tool"
              href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
            >
              Data Transfer Tool
            </ExternalLink>{' '}
            Tool to continue.
          </p>
        </BaseModal>
      )
    );
  } else {
    dispatch(
      setModal(
        <CheckBoxModal
          dbGapList={dbGapList}
          CustomButton={agreed => (
            <Button
              disabled={!agreed}
              onClick={() => {
                setState(s => ({ ...s, cartDownloading: true }));
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
                  () => setState(s => ({ ...s, cartDownloading: false }))
                );
              }}
              style={{ margin: '0 10px' }}
            >
              Download {authorized.doc_count} Authorized Files
            </Button>
          )}
          dispatch={dispatch}
        />
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
      className="test-cart-download-dropdown"
      dropdownStyle={{
        marginTop: '2px',
        borderRadius: '4px',
      }}
      dropdownItemClass={false}
      button={
        <Button
          style={{ marginLeft: '1em' }}
          leftIcon={
            state.manifestDownloading || state.cartDownloading ? (
              <Spinner />
            ) : (
              <DownloadIcon />
            )
          }
          rightIcon={<DownCaretIcon />}
        >
          Download
        </Button>
      }
    >
      <Column>
        <DownloadButton
          size={files.length}
          className="test-download-manifest"
          style={styles.button(theme)}
          endpoint="manifest"
          activeText="Manifest"
          inactiveText="Manifest"
          altMessage={false}
          setParentState={currentState =>
            setState(s => ({ ...s, manifestDownloading: currentState }))}
          active={state.manifestDownloading}
          extraParams={{
            ids: files.map(file => file.file_id),
          }}
        />
        <Button
          className="test-download-cart"
          style={styles.button(theme)}
          disabled={state.cartDownloading}
          onClick={() =>
            downloadCart({
              user,
              files,
              dispatch,
              disableAgreement: false,
              setState,
            })}
          leftIcon={state.cartDownloading ? <Spinner /> : <DownloadIcon />}
        >
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
