
import React from 'react';
import { isEqual } from 'lodash';
import { connect } from 'react-redux';
import {
  compose,
  lifecycle,
  pure,
  setDisplayName,
  withHandlers,
  withState,
} from 'recompose';
import ResizeObserver from 'resize-observer-polyfill';

import { dismissNotification, removeNotification } from '@ncigdc/dux/bannerNotification';
import nciGdcLogo from '@ncigdc/theme/images/NHI_GDC_DataPortal-logo.svg';
import HomeLink from '@ncigdc/components/Links/HomeLink';
import AnalysisLink from '@ncigdc/components/Links/AnalysisLink';
import RepositoryLink from '@ncigdc/components/Links/RepositoryLink';
import CartLink from '@ncigdc/components/Links/CartLink';
import ExploreLink, { defaultExploreQuery } from '@ncigdc/components/Links/ExploreLink';
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
import withControlledAccess from '@ncigdc/utils/withControlledAccess';
import Banner from '@ncigdc/uikit/Banner';
import { withTheme } from '@ncigdc/theme';
import { AnalysisIcon } from '@ncigdc/theme/icons';
import DatabaseIcon from '@ncigdc/theme/icons/Database';
import ManageSetsLink from '@ncigdc/components/Links/ManageSetsLink';
import { Row } from '@ncigdc/uikit/Flex';
import { DISPLAY_DAVE_CA } from '@ncigdc/utils/constants';

import SectionBanner from './SectionBanner';
import './styles.scss';

const styles = {
  activeNavLink: theme => ({
    backgroundColor: theme.greyScale2,
    color: theme.white,
  }),
};

const Header = ({
  dispatch,
  handleOnClick,
  headerHeight,
  isCollapsed,
  isInSearchMode,
  notifications,
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
      {notifications.map(n => (
        <Banner
          {...n}
          handleOnDismiss={() => dispatch(dismissNotification(n.id))}
          key={n.id}
          />
      ))}

      <div className="header-navbar">
        <div className="navbar-mobile_items">
          <HomeLink
            className="navbar-brand"
            tabIndex="0"
            >
            <img
              alt="gdc-logo"
              src={nciGdcLogo}
              />
            <Hidden>
              <h1>GDC Home</h1>
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
          className={`navbar-collapse${isCollapsed ? ' collapse' : ''}`}
          data-uib-collapse="hc.isCollapsed"
          style={{ outline: 'none' }}
          tabIndex="-1"
          >
          <ul className="nav navbar-nav">
            <li>
              <HomeLink
                activeStyle={styles.activeNavLink(theme)}
                exact
                onClick={handleOnClick}
                testTag="home-link"
                >
                <i className="fa fa-home" />
                <span className="header-hidden-sm">Home</span>
                <Hidden>Home</Hidden>
              </HomeLink>
            </li>

            <li>
              <ProjectsLink
                activeStyle={styles.activeNavLink(theme)}
                exact
                onClick={handleOnClick}
                testTag="projects-link"
                >
                <i className="icon-gdc-projects" />
                <span className="header-hidden-sm">Projects</span>
                <Hidden>Projects</Hidden>
              </ProjectsLink>
            </li>

            <li>
              <ExploreLink
                activeStyle={styles.activeNavLink(theme)}
                exact
                isDropDown
                onClick={handleOnClick}
                query={defaultExploreQuery}
                testTag="exploration-link"
                >
                <i className="icon-gdc-data" />
                <span className="header-hidden-sm">Exploration</span>
                <Hidden>Exploration</Hidden>
              </ExploreLink>
            </li>

            <li>
              <AnalysisLink
                activeStyle={styles.activeNavLink(theme)}
                exact
                onClick={handleOnClick}
                testTag="analysis-link"
                >
                <Row
                    // needed for handling IE default svg style
                  style={{ alignItems: 'center' }}
                  >
                  <AnalysisIcon />
                  <span className="header-hidden-sm">Analysis</span>
                  <Hidden>Analysis</Hidden>
                </Row>
              </AnalysisLink>
            </li>

            <li>
              <RepositoryLink
                activeStyle={styles.activeNavLink(theme)}
                exact
                onClick={handleOnClick}
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

            {isInSearchMode || (
              <React.Fragment>
                <li>
                  <ManageSetsLink
                    activeStyle={styles.activeNavLink(theme)}
                    onClick={handleOnClick}
                    testTag="manageSet-link"
                    />
                </li>

                <li>
                  {user
                    ? <UserDropdown testTag="user-link" />
                    : <LoginButton testTag="login-link" />}
                </li>

                <li>
                  <CartLink
                    className="header-link"
                    onClick={handleOnClick}
                    testTag="cart-link"
                    >
                    {count => (
                      <span>
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

                <li>
                  <GDCAppsDropdown testTag="gdcApps-link" />
                </li>
              </React.Fragment>
            )}
          </ul>
        </nav>
      </div>

      {DISPLAY_DAVE_CA && <SectionBanner />}
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
  setDisplayName('EnhancedHeader'),
  withState('headerHeight', 'setHeaderHeight', 0),
  withState('isCollapsed', 'setIsCollapsed', true),
  withState('isInSearchMode', 'setIsInSearchMode', false),
  withControlledAccess,
  withRouter,
  connect(state => ({
    error: state.error,
    notifications: state.bannerNotification,
    user: state.auth.user,
  })),
  withHandlers({
    handleApiError: ({ dispatch }) => ({ status, user }) => {
      if (user && status === 401) {
        dispatch(removeNotification('LOGIN'));
        dispatch(setModal(<SessionExpiredModal />));
        dispatch(forceLogout());
      }
    },
    handleOnClick: ({
      controlledAccessProps,
      dispatch,
      setIsCollapsed,
    }) => (event, elementOnClick) => {
      setIsCollapsed(true);
      elementOnClick && elementOnClick(event, dispatch, controlledAccessProps);
    },
    resizeObserver: ({ setHeaderHeight }) => () =>
      new ResizeObserver(([{ target }]) => { // the target here will be the header itself
        setHeaderHeight(target.offsetHeight);
      }),
  }),
  lifecycle({
    componentDidMount() {
      const {
        error,
        handleApiError,
        resizeObserver,
        user,
      } = this.props;

      error && handleApiError({
        ...error,
        user,
      });

      resizeObserver().observe(document.querySelector('header#header'));
    },
    componentWillMount() {
      if (!this.props.user) {
        this.props.dispatch(removeNotification('LOGIN'));
      }
    },
    componentWillReceiveProps({
      error: nextError,
      user: nextUser,
    }: Object): void {
      const {
        error,
      } = this.props;
      if (nextError !== error) {
        this.props.handleApiError({
          ...nextError,
          user: nextUser,
        });
      }
    },
    shouldComponentUpdate({
      error: nextError,
      headerHeight: nextHeaderHeight,
      isCollapsed: nextIsCollapsed,
      isInSearchMode: nextIsInSearchMode,
      location: nextLocation,
      notifications: nextNotifications,
      user: nextUser,
    }) {
      const {
        error,
        headerHeight,
        isCollapsed,
        isInSearchMode,
        location,
        notifications,
        user,
      } = this.props;

      return !(
        nextError === error &&
        nextHeaderHeight === headerHeight &&
        nextIsCollapsed === isCollapsed &&
        nextIsInSearchMode === isInSearchMode &&
        isEqual(nextNotifications, notifications) &&
        isEqual(nextLocation, location) &&
        nextUser === user
      );
    },
  }),
  withTheme,
  pure,
)(Header);
