// @flow

import React from 'react';
import { compose, pure, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { dismissNotification } from '@ncigdc/dux/bannerNotification';

import nciGdcLogo from '@ncigdc/theme/images/NHI_GDC_DataPortal-logo.svg';

import HomeLink from '@ncigdc/components/Links/HomeLink';
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
)(({ user, notifications, dispatch, theme }) =>
  <header
    id="header"
    className="navbar navbar-default navbar-static-top"
    // data-ng-class="{ blue: hc.bannerDismissed }"
    role="banner"
  >

    {notifications.map(n =>
      <Banner
        {...n}
        key={n.id}
        handleOnDismiss={() => dispatch(dismissNotification(n.id))}
      />,
    )}

    <div className="container-fluid">
      <div className="navbar-header">
        <button
          type="button"
          className="navbar-toggle"
          data-ng-click="hc.toggleCollapsed()"
        >
          <span className="sr-only test-toggle-navigation" data-translate>
            Toggle navigation
          </span>
          <span className="icon-bar" />
          <span className="icon-bar" />
          <span className="icon-bar" />
        </button>
        <HomeLink
          id="gdc-logo"
          className="navbar-brand"
          tabIndex="0"
          style={{ padding: 0 }}
        >
          <img src={nciGdcLogo} alt="gdc-logo" /><Hidden>Home</Hidden>
        </HomeLink>
      </div>
      <nav
        style={{ outline: 'none' }}
        className="navbar-collapse collapse navbar-responsive-collapse"
        data-uib-collapse="hc.isCollapsed"
        data-ng-click="hc.collapse($event)"
        tabIndex="-1"
        data-ng-keypress="hc.collapse($event)"
        aria-label="{{ 'Site Navigation' | translate }}"
      >
        <ul className="nav navbar-nav">
          <li
            data-ng-class="{ active: hc.$state.includes('home') }"
            id="header-home"
          >
            {/* tabindexes */}
            <HomeLink
              exact
              activeStyle={styles.activeNavLink(theme)}
              className="HomeLink"
            >
              <i className="fa fa-home" style={styles.iconPadding} />
              <span className="hidden-sm" data-translate>Home</span>
            </HomeLink>
          </li>
          <li
            data-ng-class="{ active: hc.$state.includes('projects') }"
            id="header-projects"
          >
            <ProjectsLink
              exact
              activeStyle={styles.activeNavLink(theme)}
              className="ProjectsLink"
            >
              <i className="icon-gdc-projects" style={styles.iconPadding} />
              <span className="hidden-sm" data-translate>Projects</span>
            </ProjectsLink>
          </li>
          <li>
            <ExploreLink
              exact
              activeStyle={styles.activeNavLink(theme)}
              className="ExploreLink"
            >
              <i className="icon-gdc-data" style={styles.iconPadding} />
              <span className="hidden-sm" data-translate>Exploration</span>
            </ExploreLink>
          </li>
          <li
            data-ng-class="{ active: hc.$state.includes('search') || hc.$state.includes('query') }"
            id="header-repository"
          >
            <RepositoryLink
              exact
              activeStyle={styles.activeNavLink(theme)}
              className="RepositoryLink"
            >
              <i className="fa fa-database" style={styles.iconPadding} />
              <span className="hidden-sm" data-translate>Repository</span>
            </RepositoryLink>
          </li>
          {!!process.env.SHOW_ANALYSIS_MENU &&
            <li id="header-analysis">
              <a
                href="https://gdc.cancer.gov/access-data/analytical-tools"
                tabIndex="0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa fa-bar-chart" style={styles.iconPadding} />
                <span className="hidden-sm" data-translate>Analysis</span>
              </a>
            </li>}
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li>
            <QuickSearch tabIndex="0" />
          </li>
          {!user &&
            <li id="header-login">
              <LoginButton />
            </li>}
          {user &&
            <li className="hidden-xs">
              <UserDropdown />
            </li>}
          {/* if hc.cookieEnabled */}
          <li className="nav-cart">
            <CartLink>
              {count =>
                <span>
                  <i
                    className="fa fa-shopping-cart"
                    style={styles.iconPadding}
                  />
                  <span
                    className="hidden-md hidden-sm"
                    style={styles.iconPadding}
                  >
                    Cart
                  </span>
                  <span className="label label-primary">
                    {count.toLocaleString()}
                  </span>
                </span>}
            </CartLink>
          </li>
          <li className="nav-GDCApps">
            <GDCAppsDropdown />
          </li>
        </ul>
      </nav>
    </div>
  </header>,
);

export default Header;
