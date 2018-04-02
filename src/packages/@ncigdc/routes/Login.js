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

            {this.props.user &&
              window.location.search.includes('error=no_fence_projects') && (
                <div>
                  <br />
                  <br />You have not been granted access to any AWG projects by
                  the AWG Admin. Please contact the AWG administrator to request
                  access.
                </div>
              )}
            {this.props.user &&
              window.location.search.includes('error=no_nih_projects') && (
                <NihWarning />
              )}
            {this.props.user &&
              window.location.search.includes('error=no_intersection') && (
                <NihWarning />
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
