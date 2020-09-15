// @flow

import React from 'react';
import { connect } from 'react-redux';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import urlJoin from 'url-join';
import { userProjectsCount } from '@ncigdc/utils/auth';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import styled from '@ncigdc/theme/styled';
import DownloadIcon from '@ncigdc/theme/icons/Download';
import { fetchToken, forceLogout } from '@ncigdc/dux/auth';
import { notify } from '@ncigdc/dux/notification';
import UserIcon from '@ncigdc/theme/icons/User';
import SignOutIcon from '@ncigdc/theme/icons/SignOut';
import UserProfileModal from '@ncigdc/components/Modals/UserProfileModal';
import { setModal } from '@ncigdc/dux/modal';
import {
  AUTH,
  IS_DEV,
  AWG,
} from '@ncigdc/utils/constants';

const iconStyle = {
  fontSize: '1.65rem',
  marginRight: '0.5rem',
};

const DropdownItemStyled = styled(DropdownItem, {
  alignItems: 'center',
  cursor: 'pointer',
  padding: '0.3rem 1rem',
});

const logout = async dispatch => {
  try {
    // need to delete user from store
    dispatch(forceLogout());
  } catch (err) {
    console.warn('There was an error: ', err);
  }

  return AWG
    ? window.location.assign(urlJoin(
      AUTH,
      'logout?next=https://portal.awg.gdc.cancer.gov/login',
    ))
    : IS_DEV ||
      window.location.assign(urlJoin(
        AUTH,
        `logout?next=${
          window.location.port ? `:${window.location.port}` : ''
        }${window.location.pathname}`,
      ));
};

const UserDropdown = connect(state => ({
  token: state.auth.token,
  user: state.auth.user,
}))(({
  dispatch,
  testTag = '',
  user,
}) => (
  <Dropdown
    button={(
      <button
        className="header-link"
        data-test={testTag}
        style={{ color: '#005083' }}
        type="button"
        >
        <span>{user ? user.username : 'CURRENT_USER'}</span>
        <DownCaretIcon />
      </button>
    )}
    style={{ position: 'initial' }}
    >
    {!AWG && (
      <DropdownItemStyled
        onClick={() => dispatch(setModal(<UserProfileModal />))}
        >
        <UserIcon
          style={{
            ...iconStyle,
            fontSize: '1.8rem',
            marginRight: '0.6rem',
          }}
          />
        {' User Profile'}
      </DropdownItemStyled>
    )}

    <DropdownItemStyled
      onClick={() => {
        if (userProjectsCount(user)) {
          dispatch(fetchToken());
        } else {
          dispatch(
            notify({
              action: 'warning',
              component: (
                <span>
                  {`${user.username} does not have access to any protected data within the GDC. Click `}
                  <a href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data">
                    here
                  </a>
                  {' to learn more about obtaining access to protected data.'}
                </span>
              ),
              id: `${new Date().getTime()}`,
            }),
          );
        }
      }}
      >
      <DownloadIcon style={iconStyle} />
      Download Token
    </DropdownItemStyled>
    <DropdownItemStyled onClick={() => logout(dispatch)}>
      <SignOutIcon aria-hidden="true" style={iconStyle} />
      Logout
    </DropdownItemStyled>
  </Dropdown>
));

export default UserDropdown;
