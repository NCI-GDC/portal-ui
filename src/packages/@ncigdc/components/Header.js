// @flow

import React from 'react';
import { compose, pure, lifecycle, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';

import { dismissNotification } from '@ncigdc/dux/bannerNotification';
import nciGdcLogo from '@ncigdc/theme/images/NHI_GDC_DataPortal-logo.svg';
import HomeLink from '@ncigdc/components/Links/HomeLink';
import AnalysisLink from '@ncigdc/components/Links/AnalysisLink';
import RepositoryLink from '@ncigdc/components/Links/RepositoryLink';
import CartLink from '@ncigdc/components/Links/CartLink';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import ProjectsLink from '@ncigdc/components/Links/ProjectsLink';
import GDCAppsDropdown from '@ncigdc/components/GDCApps/GDCAppsDropdown';
import QuickSearch from '@ncigdc/components/QuickSearch/QuickSearch';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Hidden from '@ncigdc/components/Hidden';
import { setModal } from '@ncigdc/dux/modal';
import { forceLogout } from '@ncigdc/dux/auth';
import SessionExpiredModal from '@ncigdc/components/Modals/SessionExpiredModal';
import withRouter from '@ncigdc/utils/withRouter';
import Banner from '@ncigdc/uikit/Banner';
import { withTheme } from '@ncigdc/theme';
import styled from '@ncigdc/theme/styled';
import { AnalysisIcon } from '@ncigdc/theme/icons';
import DatabaseIcon from '@ncigdc/theme/icons/Database';
import ManageSetsLink from '@ncigdc/components/Links/ManageSetsLink';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';

import './Header.css';

const DropdownItemStyled = styled(DropdownItem, {
  cursor: 'pointer',
});

const styles = {
  iconPadding: {
    paddingRight: '4px',
  },
  activeNavLink: theme => ({
    backgroundColor: theme.greyScale2,
    color: theme.white,
  }),
};

const NavLink = styled.a({
  padding: '15px 13px',
  display: 'inline-block',
  ':hover': {
    backgroundColor: '#dedddd',
  },
});

const Header = compose(
  withState('isCollapsed', 'setIsCollapsed', true),
  withRouter,
  connect(state => ({
    notifications: state.bannerNotification,
    user: state.auth.user,
    error: state.error,
  })),
  withHandlers({
    handleApiError: ({ dispatch }) => ({ status, user }) => {
      if (user && status === 401) {
        dispatch(setModal(<SessionExpiredModal />));
        dispatch(forceLogout());
      }
    },
  }),
  lifecycle({
    componentDidMount(): void {
      if (this.props.error) {
        this.props.handleApiError({
          ...this.props.error,
          user: this.props.user,
        });
      }
    },
    componentWillReceiveProps(nextProps: Object): void {
      if (nextProps.error !== this.props.error) {
        this.props.handleApiError({ ...nextProps.error, user: nextProps.user });
      }
    },
  }),
  withTheme,
  pure,
)(({ user, notifications, dispatch, theme, isCollapsed, setIsCollapsed }) => (
  <header
    id="header"
    className="navbar navbar-default navbar-static-top"
    role="banner"
  >
    {notifications.map(n => (
      <Banner
        {...n}
        key={n.id}
        handleOnDismiss={() => dispatch(dismissNotification(n.id))}
      />
    ))}
    <div className="container-fluid">
      <div className="navbar-header">
        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className="sr-only test-toggle-navigation">
            Toggle navigation
          </span>
          <span className="icon-bar" />
          <span className="icon-bar" />
          <span className="icon-bar" />
        </button>
        <HomeLink className="navbar-brand" tabIndex="0" style={{ padding: 0 }}>
          <img src={nciGdcLogo} alt="gdc-logo" />
          <Hidden>Home</Hidden>
        </HomeLink>
      </div>
      <nav
        style={{ outline: 'none' }}
        className={`navbar-collapse ${isCollapsed ? 'collapse' : ''}`}
        data-uib-collapse="hc.isCollapsed"
        tabIndex="-1"
        aria-label="Site Navigation"
        onClick={() => setIsCollapsed(true)}
      >
        <ul className="nav navbar-nav">
          <li>
            <HomeLink exact activeStyle={styles.activeNavLink(theme)}>
              <i className="fa fa-home" style={styles.iconPadding} />
              <span className="header-hidden-sm">Home</span>
            </HomeLink>
          </li>
          <li>
            <ProjectsLink exact activeStyle={styles.activeNavLink(theme)}>
              <i className="icon-gdc-projects" style={styles.iconPadding} />
              <span className="header-hidden-sm">Projects</span>
            </ProjectsLink>
          </li>
          <li>
            <ExploreLink exact activeStyle={styles.activeNavLink(theme)}>
              <i className="icon-gdc-data" style={styles.iconPadding} />
              <span className="header-hidden-sm">Exploration</span>
            </ExploreLink>
          </li>
          <li>
            <AnalysisLink exact activeStyle={styles.activeNavLink(theme)}>
              <AnalysisIcon style={styles.iconPadding} />
              <span className="header-hidden-sm">Analysis</span>
            </AnalysisLink>
          </li>
          <li>
            <RepositoryLink exact activeStyle={styles.activeNavLink(theme)}>
              <DatabaseIcon style={styles.iconPadding} />
              <span className="header-hidden-sm">Repository</span>
            </RepositoryLink>
          </li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li>
            <QuickSearch tabIndex="0" />
          </li>
          <li>
            <ManageSetsLink activeStyle={styles.activeNavLink(theme)} />
          </li>
          {/* for demo purposes */}
          <li>
            <Dropdown
              dropdownStyle={{ width: '300px' }}
              button={
                <NavLink>
                  <span>{user ? user.username : 'LOGIN'}</span>
                  <DownCaretIcon style={{ marginLeft: 'auto' }} />
                </NavLink>
              }
            >
              <DropdownItemStyled
                onClick={() => {
                  dispatch({
                    type: 'gdc/USER_SUCCESS',
                    payload: {
                      username: 'TCGA USER',
                    },
                    project_ids: ['TCGA-BRCA'],
                  });
                }}
              >
                User with TCGA controlled access
              </DropdownItemStyled>
              <DropdownItemStyled
                onClick={() => {
                  dispatch({
                    type: 'gdc/USER_SUCCESS',
                    payload: {
                      username: 'TARGET USER',
                    },
                    project_ids: ['TARGET-NBL'],
                  });
                }}
              >
                User with TARGET controlled access
              </DropdownItemStyled>
              <DropdownItemStyled
                onClick={() => {
                  dispatch({
                    type: 'gdc/USER_SUCCESS',
                    payload: null,
                    project_ids: [],
                  });
                }}
              >
                Logout
              </DropdownItemStyled>
            </Dropdown>
          </li>
          {/* for demo purposes
            {!user && (
            <li>
              <LoginButton />
            </li>
          )}
          {user && (
            <li className="header-hidden-xs">
              <UserDropdown />
            </li>
          )} */}
          <li>
            <CartLink>
              {count => (
                <span>
                  <i
                    className="fa fa-shopping-cart"
                    style={styles.iconPadding}
                  />
                  <span
                    className="header-hidden-sm header-hidden-md"
                    style={styles.iconPadding}
                  >
                    Cart
                  </span>
                  <span className="label label-primary">
                    {count.toLocaleString()}
                  </span>
                </span>
              )}
            </CartLink>
          </li>
          <li>
            <GDCAppsDropdown />
          </li>
        </ul>
      </nav>
    </div>
  </header>
));

export default Header;
