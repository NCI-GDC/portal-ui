// @flow

import React from 'react';
import { compose, pure, lifecycle, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';

import { dismissNotification } from '@ncigdc/dux/bannerNotification';
import nciGdcLogo from '@ncigdc/theme/images/NHI_GDC_DataPortal-logo.svg';
import HomeLink from '@ncigdc/components/Links/HomeLink';
import RepositoryLink from '@ncigdc/components/Links/RepositoryLink';
import CartLink from '@ncigdc/components/Links/CartLink';
import ProjectsLink from '@ncigdc/components/Links/ProjectsLink';
import GDCAppsDropdown from '@ncigdc/components/GDCApps/GDCAppsDropdown';
import QuickSearch from '@ncigdc/components/QuickSearch/QuickSearch';
import LoginButton from '@ncigdc/components/LoginButton';
import UserDropdown from '@ncigdc/components/UserDropdown';
import Hidden from '@ncigdc/components/Hidden';
import { setModal } from '@ncigdc/dux/modal';
import { forceLogout } from '@ncigdc/dux/auth';
import SessionExpiredModal from '@ncigdc/components/Modals/SessionExpiredModal';
import withRouter from '@ncigdc/utils/withRouter';
import Banner from '@ncigdc/uikit/Banner';
import { withTheme } from '@ncigdc/theme';
import DatabaseIcon from '@ncigdc/theme/icons/Database';

import './Header.css';

const styles = {
  iconPadding: {
    paddingRight: '4px',
  },
  activeNavLink: theme => ({
    backgroundColor: theme.greyScale2,
    color: theme.white,
  }),
};

const Header = compose(
  withState('isCollapsed', 'setIsCollapsed', true),
  withState('isInSearchMode', 'setIsInSearchMode', false),
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
)(
  ({
    user,
    notifications,
    dispatch,
    theme,
    isCollapsed,
    setIsCollapsed,
    isInSearchMode,
    setIsInSearchMode,
  }) => (
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
          <HomeLink
            className="navbar-brand"
            tabIndex="0"
            style={{ padding: 0 }}
          >
            <img
              style={{ width: 260 }}
              src="https://i.imgur.com/O33FmeE.png"
              alt="gdc-logo"
            />
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
              <ProjectsLink exact activeStyle={styles.activeNavLink(theme)}>
                <i className="icon-gdc-projects" style={styles.iconPadding} />
                <span className="header-hidden-sm">Projects</span>
                <Hidden>Projects</Hidden>
              </ProjectsLink>
            </li>
            <li>
              <RepositoryLink exact activeStyle={styles.activeNavLink(theme)}>
                <DatabaseIcon style={styles.iconPadding} />
                <span className="header-hidden-sm">Repository</span>
                <Hidden>Repository</Hidden>
              </RepositoryLink>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <QuickSearch
                isInSearchMode={isInSearchMode}
                setIsInSearchMode={setIsInSearchMode}
                tabIndex="0"
              />
            </li>
            {!user &&
              !isInSearchMode && (
                <li>
                  <LoginButton />
                </li>
              )}
            {user &&
              !isInSearchMode && (
                <li className="header-hidden-xs">
                  <UserDropdown />
                </li>
              )}
            {!isInSearchMode && (
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
            )}
            {!isInSearchMode && (
              <li>
                <GDCAppsDropdown />
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  ),
);

export default Header;
