import React from 'react';
import { connect } from 'react-redux';
import LoginButton from '@ncigdc/components/LoginButton';

const styles = {
  title: {
    color: 'rgb(38, 89, 134)',
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: 4,
    fontSize: 22,
  },
};

export default connect(state => ({
  user: state.auth.user,
}))(
  class extends React.Component {
    state = { loggingIn: false };
    componentDidMount() {}
    render() {
      let NihWarning = () => (
        <div>
          <br />
          <br />You do not have access to any AWG projects in dbGaP. More
          information about obtaining access to controlled-access data can be
          found{' '}
          <a href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data">
            here
          </a>.
        </div>
      );
      return (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundColor: 'white',
            width: '100vw',
            height: '100vh',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              height: '400px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div>
              <img
                alt="NCI GDC AWG Portal"
                style={{ width: 525 }}
                src="https://i.imgur.com/O33FmeE.png"
              />
            </div>

            {window.location.search.includes('error=no_fence_projects') && (
              <div>
                <br />
                <br />You have not been granted access to any AWG projects by
                the AWG Admin. Please contact the AWG administrator to request
                access.
              </div>
            )}
            {window.location.search.includes('error=timeout') && (
              <div>
                <br />
                <br />Session timed out or not authorized.
              </div>
            )}
            {window.location.search.includes('error=no_nih_projects') && (
              <NihWarning />
            )}
            {window.location.search.includes('error=no_intersection') && (
              <NihWarning />
            )}
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <h1 style={styles.title}>Analysis Working Group</h1>
              <h1 style={(styles.title, { margin: '0 0 20px' })}>
                Data Portal
              </h1>
              <div style={{ fontSize: '3em', color: 'rgb(38, 89, 134)' }}>
                <i className="fa fa-users" />
              </div>
              <LoginButton>
                <button
                  style={{
                    marginTop: '1.2em',
                    backgroundColor: 'rgb(38, 89, 134)',
                    color: 'white',
                    fontSize: 16,
                    border: 'none',
                    borderRadius: 4,
                    padding: '12px 30px',
                    cursor: 'pointer',
                    fontWeight: 200,
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                  }}
                >
                  Login
                </button>
              </LoginButton>
            </div>
          </div>
        </div>
      );
    }
  },
);
