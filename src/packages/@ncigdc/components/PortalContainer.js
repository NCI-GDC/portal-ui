// @flow

import React from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { compose, lifecycle } from 'recompose';
import Header from '@ncigdc/components/Header';
import Footer from '@ncigdc/components/Footer';
import NotificationContainer from '@ncigdc/components/NotificationContainer';
import RelayLoadingContainer from '@ncigdc/components/RelayLoadingContainer';
import ProgressContainer from '@ncigdc/components/ProgressContainer';
import ModalContainer from '@ncigdc/components/ModalContainer';
import Routes from '@ncigdc/routes';
import withRouter from '@ncigdc/utils/withRouter';
import { GlobalTooltip } from '@ncigdc/uikit/Tooltip';
import styled from '@ncigdc/theme/styled';
import { setModal } from '@ncigdc/dux/modal';
import FirstTimeModal from '@ncigdc/components/Modals/FirstTimeModal';

const SkipLink = styled.a({
  position: 'absolute',
  left: '-999px',
  backgroundColor: '#fff',
  zIndex: 1000,
});

const FIRST_TIME_KEY = 'NCI-Warning';

const enhance = compose(
  withRouter,
  connect(store => ({ notifications: store.bannerNotification })),
  lifecycle({
    componentDidMount(): void {
      if (!Cookies.get(FIRST_TIME_KEY)) {
        this.props.dispatch(setModal(<FirstTimeModal />));
        Cookies.set(FIRST_TIME_KEY, true);
      }

      let lastPathname = this.props.location.pathname;
      this.removeListen = this.props.history.listen(location => {
        if (location.pathname !== lastPathname) {
          window.scrollTo(0, 0);
          lastPathname = location.pathname;
        }
      });
    },
    componentWillUnmount(): void {
      this.removeListen();
    },
  }),
);
const PortalContainer = ({
  notifications,
}: {
  notifications: Array<{ dismissed: string }>,
}) =>
  <div
    style={{
      position: 'relative',
      minHeight: '100vh',
      minWidth: 1024,
      overflowX: 'hidden',
    }}
  >
    <SkipLink href="#skip">Skip to Main Content</SkipLink>
    <ProgressContainer />
    <Header />
    <div
      id="skip"
      style={{
        paddingTop: `calc(51px + ${notifications.filter(n => !n.dismissed)
          .length * 40}px)`,
        paddingBottom: '120px',
        transition: 'padding 0.25s ease',
      }}
    >
      <Routes />
    </div>
    <Footer />
    <RelayLoadingContainer />
    <NotificationContainer />
    <ModalContainer />
    <GlobalTooltip />
  </div>;

export default enhance(PortalContainer);
