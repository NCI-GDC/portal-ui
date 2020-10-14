import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  pure,
  setDisplayName,
} from 'recompose';
import queryString from 'query-string';

import { AUTH, FENCE } from '@ncigdc/utils/constants';
import { fetchUser } from '@ncigdc/dux/auth';
import {
  clearAWGSession,
  createAWGSession,
} from '@ncigdc/utils/auth/awg';
import Button from '@ncigdc/uikit/Button';
import { Row } from '@ncigdc/uikit/Flex';
import openAuthWindow from '@ncigdc/utils/openAuthWindow';
import withRouter from '@ncigdc/utils/withRouter';

const styles = {
  errorMessage: {
    color: 'rgb(191, 34, 58)',
    fontSize: 16,
  },
  loginButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 200,
    letterSpacing: 2,
    padding: '12px 30px',
    textTransform: 'uppercase',
    width: 140,
  },
  title: {
    color: 'rgb(38, 89, 134)',
    fontSize: 22,
    fontWeight: 400,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
};

const AWGLoginButton = compose(
  setDisplayName('EnhancedAWGLoginButton'),
  connect(state => state.auth),
  withRouter,
  pure,
)(({ dispatch, push }) => (
  <Button
    onClick={async () => {
      const loginParams = queryString.stringify({
        redirect: window.location.origin,
      });

      try {
        await openAuthWindow({
          name: 'AWG',
          pollInterval: 200,
          winUrl: `${AUTH}?next=${FENCE}/login/fence?${loginParams}`,
        });
      } catch (err) {
        if (err === 'window closed manually') {
          return;
        }
        if (err === 'login_error') {
          return (window.location.href = '/login?error=no_fence_projects');
        }
      }
      const createdSession = await createAWGSession();

      if (createdSession) {
        await dispatch(fetchUser());
        push({ pathname: '/repository' });
      }
    }}
    style={styles.loginButton}
    >
    Login
  </Button>
));

const LoginRoute = () => (
  <div
    style={{
      alignItems: 'center',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      justifyContent: 'center',
      left: 0,
      position: 'fixed',
      top: 0,
      width: '100vw',
      zIndex: 1000,
    }}
    >
    <div
      style={{
        alignItems: 'center',
        flexDirection: 'column',
        height: '400px',
        justifyContent: 'center',
        textAlign: 'center',
      }}
      >
      <div>
        <img
          alt="NCI GDC AWG Portal"
          src="https://i.imgur.com/O33FmeE.png"
          style={{ width: 525 }}
          />
      </div>
      <br />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        >
        <h1 style={styles.title}>Analysis Working Group</h1>

        <h1
          style={{
            ...styles.title,
            margin: '0 0 20px',
          }}
          >
          Data Portal
        </h1>

        <div
          style={{
            color: 'rgb(38, 89, 134)',
            fontSize: '3em',
          }}
          >
          <i className="fa fa-users" />
        </div>

        {window.location.search.includes('error=no_fence_projects') && (
          <div>
            <br />
            <br />
            <span style={styles.errorMessage}>
              You have not been granted access to any AWG projects by the
              AWG Admin. Please contact the AWG administrator to request
              access.
            </span>
          </div>
        )}

        {window.location.search.includes('error=timeout') && (
          <div>
            <br />
            <br />
            <span style={styles.errorMessage}>
              Session timed out or not authorized.
            </span>
          </div>
        )}

        {(
          window.location.search.includes('error=no_nih_projects') ||
          window.location.search.includes('error=no_intersection')
        ) && (
          <div>
            <br />
            <br />
            {'You do not have access to any AWG projects in dbGaP. More information about obtaining access to controlled-access data can be found '}
            <a href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data">here</a>
            .
          </div>
        )}

        <Row
          style={{
            justifyContent: 'center',
            marginTop: '1.5rem',
          }}
          >
          <AWGLoginButton />
        </Row>
      </div>
    </div>
  </div>
);

export default connect(({ auth }) => ({
  error: auth.error,
  user: auth.user,
}))(LoginRoute);
