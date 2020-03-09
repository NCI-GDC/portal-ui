// @flow
import React from 'react';
import {
  compose,
  lifecycle,
  pure,
  setDisplayName,
  withHandlers,
  withState,
} from 'recompose';
import { connect } from 'react-redux';
import ResizeObserver from 'resize-observer-polyfill';

import HomeLink from '@ncigdc/components/Links/HomeLink';
import RepositoryLink from '@ncigdc/components/Links/RepositoryLink';
import CartLink from '@ncigdc/components/Links/CartLink';
import ProjectsLink from '@ncigdc/components/Links/ProjectsLink';
import QuickSearch from '@ncigdc/components/QuickSearch/QuickSearch';
import UserDropdown from '@ncigdc/components/UserDropdown';
import Hidden from '@ncigdc/components/Hidden';
import withRouter from '@ncigdc/utils/withRouter';
import { withTheme } from '@ncigdc/theme';
import DatabaseIcon from '@ncigdc/theme/icons/Database';

import './styles.scss';

const styles = {
  activeNavLink: theme => ({
    backgroundColor: theme.greyScale2,
    color: theme.white,
  }),
};

const Header = ({
  headerHeight,
  isCollapsed,
  isInSearchMode,
  setIsCollapsed,
  setIsInSearchMode,
  theme,
  user,
}) => (
  <React.Fragment>
    <header
      className="navbar navbar-default navbar-static-top"
      id="header"
      role="banner"
      >
      <div className="header-navbar">
        <div className="navbar-mobile_items">
          <HomeLink
            className="navbar-brand"
            tabIndex="0"
            >
            <img
              alt="gdc-logo"
              src="https://i.imgur.com/O33FmeE.png"
              />
            <Hidden>
              <h1>Home</h1>
            </Hidden>
          </HomeLink>

          <button
            className="navbar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            type="button"
            >
            <span className="sr-only test-toggle-navigation">
              Toggle navigation
            </span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
        </div>

        <nav
          aria-label="Site Navigation"
          className={`navbar-collapse ${isCollapsed ? 'collapse' : ''}`}
          data-uib-collapse="hc.isCollapsed"
          style={{ outline: 'none' }}
          tabIndex="-1"
          >
          <ul className="nav navbar-nav">
            <li>
              <ProjectsLink
                activeStyle={styles.activeNavLink(theme)}
                exact
                onClick={setIsCollapsed}
                testTag="projects-link"
                >
                <i className="icon-gdc-projects" />
                <span className="header-hidden-sm">Projects</span>
                <Hidden>Projects</Hidden>
              </ProjectsLink>
            </li>

            <li>
              <RepositoryLink
                activeStyle={styles.activeNavLink(theme)}
                exact
                onClick={setIsCollapsed}
                testTag="repository-link"
                >
                <DatabaseIcon />
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
                testTag="quicksearch"
                />
            </li>

            {!isInSearchMode && (
              <React.Fragment>
                {user && (
                  <li>
                    <UserDropdown testTag="user-link" />
                  </li>
                )}

                <li>
                  <CartLink
                    onClick={setIsCollapsed}
                    testTag="cart-link"
                    >
                    {count => (
                      <span className="header-link">
                        <i className="fa fa-shopping-cart" />

                        <span className="header-hidden-sm header-hidden-md">
                          Cart
                        </span>

                        <span className="label label-primary">
                          {count.toLocaleString()}
                        </span>
                      </span>
                    )}
                  </CartLink>
                </li>
              </React.Fragment>
            )}
          </ul>
        </nav>
      </div>
    </header>

    <div
      id="headerSpacer"
      style={{
        border: 'none',
        height: headerHeight,
        transition: 'height 0.15s ease',
        visibility: 'hidden',
      }}
      />
  </React.Fragment>
);

export default compose(
  setDisplayName('EnhancedAWGHeader'),
  withState('headerHeight', 'setHeaderHeight', 0),
  withState('isCollapsed', 'setIsCollapsed', true),
  withState('isInSearchMode', 'setIsInSearchMode', false),
  withRouter,
  connect(state => ({
    error: state.error,
    user: state.auth.user,
  })),
  withHandlers({
    resizeObserver: ({ setHeaderHeight }) => () =>
      new ResizeObserver(([{ target }]) => { // the target here will be the header itself
        setHeaderHeight(target.offsetHeight);
      }),
  }),
  lifecycle({
    componentDidMount() {
      this.props.resizeObserver().observe(document.querySelector('header#header'));
    },
  }),
  withTheme,
  pure,
)(Header);
