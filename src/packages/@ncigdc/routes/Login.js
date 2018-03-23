import React from 'react';
import { connect } from 'react-redux';
import LoginButton from '@ncigdc/components/LoginButton';

export default connect(state => ({
  user: state.auth.user,
}))(
  class extends React.Component {
    state = { loggingIn: false };
    componentDidMount() {}
    render() {
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
                style={{ width: 525 }}
                src="https://i.imgur.com/O33FmeE.png"
              />
            </div>

            {this.props.user &&
              window.location.search.includes('error=no_projects') && (
                <div>
                  <br />
                  <br />You don't have access to any projects
                </div>
              )}
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <LoginButton />
            </div>
          </div>
        </div>
      );
    }
  },
);
