// @flow

import React from 'react';
import {
  compose, pure, lifecycle, withHandlers, withState,
} from 'recompose';
import { connect } from 'react-redux';

import { dismissNotification, removeNotification } from '@ncigdc/dux/bannerNotification';
import nciGdcLogo from '@ncigdc/theme/images/NHI_GDC_DataPortal-logo.svg';
import HomeLink from '@ncigdc/components/Links/HomeLink';
import AnalysisLink from '@ncigdc/components/Links/AnalysisLink';
import RepositoryLink from '@ncigdc/components/Links/RepositoryLink';
import CartLink from '@ncigdc/components/Links/CartLink';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
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
import { AnalysisIcon } from '@ncigdc/theme/icons';
import DatabaseIcon from '@ncigdc/theme/icons/Database';
import ManageSetsLink from '@ncigdc/components/Links/ManageSetsLink';
import { Row } from '@ncigdc/uikit/Flex';

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
        dispatch(removeNotification('LOGIN'));
        dispatch(setModal(<SessionExpiredModal />));
        dispatch(forceLogout());
      }
    },
  }),
  lifecycle({
    componentWillMount() {
      if (!this.props.user) {
        this.props.dispatch(removeNotification('LOGIN'));
      }
    },
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
        this.props.handleApiError({
          ...nextProps.error,
          user: nextProps.user,
        });
      }
    },
  }),
  withTheme,
  pure
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
      className="navbar navbar-default navbar-static-top"
      id="header"
      role="banner">
      {notifications.map(n => (
        <Banner
          {...n}
          handleOnDismiss={() => dispatch(dismissNotification(n.id))}
          key={n.id} />
      ))}
      <div className="container-fluid">
        <div className="navbar-header">
          <button
            className="navbar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            type="button">
            <span className="sr-only test-toggle-navigation">
              Toggle navigation
            </span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <HomeLink
            className="navbar-brand"
            style={{ padding: 0 }}
            tabIndex="0">
            <img alt="gdc-logo" src={nciGdcLogo} />
            <Hidden>
              <h1>GDC Home</h1>
            </Hidden>
          </HomeLink>
        </div>
        <nav
          aria-label="Site Navigation"
          className={`navbar-collapse ${isCollapsed ? 'collapse' : ''}`}
          data-uib-collapse="hc.isCollapsed"
          onClick={() => setIsCollapsed(true)}
          style={{ outline: 'none' }}
          tabIndex="-1">
          <ul className="nav navbar-nav">
            <li>
              <HomeLink exact activeStyle={styles.activeNavLink(theme)}>
                <i className="fa fa-home" style={styles.iconPadding} />
                <span className="header-hidden-sm">Home</span>
                <Hidden>Home</Hidden>
              </HomeLink>
            </li>
            <li>
              <ProjectsLink exact activeStyle={styles.activeNavLink(theme)}>
                <i className="icon-gdc-projects" style={styles.iconPadding} />
                <span className="header-hidden-sm">Projects</span>
                <Hidden>Projects</Hidden>
              </ProjectsLink>
            </li>
            <li>
              <ExploreLink exact activeStyle={styles.activeNavLink(theme)}>
                <i className="icon-gdc-data" style={styles.iconPadding} />
                <span className="header-hidden-sm">Exploration</span>
                <Hidden>Exploration</Hidden>
              </ExploreLink>
            </li>
            <li>
              <AnalysisLink exact activeStyle={styles.activeNavLink(theme)}>
                <Row
                  // needed for handling IE default svg style
                  style={{ alignItems: 'center' }}>
                  <AnalysisIcon style={styles.iconPadding} />
                  <span className="header-hidden-sm">Analysis</span>
                  <Hidden>Analysis</Hidden>
                </Row>
              </AnalysisLink>
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
                tabIndex="0" />
            </li>
            {!isInSearchMode && (
              <li>
                <ManageSetsLink activeStyle={styles.activeNavLink(theme)} />
              </li>
            )}
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
                        style={styles.iconPadding} />
                      <span
                        className="header-hidden-sm header-hidden-md"
                        style={styles.iconPadding}>
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
  )
);

export default Header;
