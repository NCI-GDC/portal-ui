// @flow

import React from 'react';
import { connect } from 'react-redux';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import urlJoin from 'url-join';
import { userProjectsCount } from '@ncigdc/utils/auth';
import { Row } from '@ncigdc/uikit/Flex';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import styled from '@ncigdc/theme/styled';
import DownloadIcon from '@ncigdc/theme/icons/Download';
import { fetchToken } from '@ncigdc/dux/auth';
import { notify } from '@ncigdc/dux/notification';
import { AUTH } from '@ncigdc/utils/constants';
import UserIcon from '@ncigdc/theme/icons/User';
import SignOutIcon from '@ncigdc/theme/icons/SignOut';
import UserProfileModal from '@ncigdc/components/Modals/UserProfileModal';
import { setModal } from '@ncigdc/dux/modal';
import { IS_DEV, AWG, FENCE } from '@ncigdc/utils/constants';

const NavLink = styled.a({
  padding: '15px 13px',
  display: 'inline-block',
  ':hover': {
    backgroundColor: '#dedddd',
  },
});

const iconStyle = {
  marginRight: '0.5rem',
  fontSize: '1.65rem',
};

const DropdownItemStyled = styled(DropdownItem, {
  cursor: 'pointer',
});

const logout = async () => {
  if (AWG) {
    try {
      await fetch(urlJoin(FENCE, 'logout'), { credentials: 'include' });
    } catch (err) {
      console.warn('There was an error: ', err);
    }
    return window.location.assign(
      urlJoin(AUTH, `logout?next=https://portal.awg.gdc.cancer.gov/login`),
    );
  } else {
    if (window.location.port) {
      window.location.assign(
        IS_DEV
          ? ``
          : urlJoin(
              AUTH,
              `logout?next=:${window.location.port}${window.location.pathname}`,
            ),
      );
    } else {
      window.location.assign(
        IS_DEV ? `` : urlJoin(AUTH, `logout?next=${window.location.pathname}`),
      );
    }
  }
};

const UserDropdown = connect(state => ({
  token: state.auth.token,
  user: state.auth.user,
}))(({ user, dispatch }) => (
  <Row style={{ alignSelf: 'stretch' }} className="test-user-dropdown">
    <Dropdown
      button={
        <NavLink>
          <span>{user ? user.username : 'CURRENT_USER'}</span>
          <DownCaretIcon style={{ marginLeft: 'auto' }} />
        </NavLink>
      }
    >
      {!AWG && (
        <DropdownItemStyled
          onClick={() => dispatch(setModal(<UserProfileModal />))}
        >
          <UserIcon
            style={{ ...iconStyle, fontSize: '1.8rem', marginRight: '0.6rem' }}
          />{' '}
          User Profile
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
                id: `${new Date().getTime()}`,
                component: (
                  <span>
                    {user.username} does not have access to any protected data
                    within the GDC. Click{' '}
                    <a href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data">
                      here
                    </a>{' '}
                    to learn more about obtaining access to protected data.
                  </span>
                ),
              }),
            );
          }
        }}
      >
        <DownloadIcon style={iconStyle} />
        Download Token
      </DropdownItemStyled>
      <DropdownItemStyled onClick={logout}>
        <SignOutIcon aria-hidden="true" style={iconStyle} />
        Logout
      </DropdownItemStyled>
    </Dropdown>
  </Row>
));

export default UserDropdown;
