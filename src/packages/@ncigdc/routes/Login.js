import React from 'react';
import { flatMap } from 'lodash';
import { connect } from 'react-redux';
import decode from 'jwt-decode';
import Aux from '@ncigdc/utils/Aux';

export default connect(state => ({
  user: state.auth.user,
  project_ids: state.auth.project_ids,
}))(
  class extends React.Component {
    state = { loggingIn: false };
    componentDidMount() {
      this.showGoogleLogin();
    }
    showGoogleLogin = () => {
      this.setState({ loggingIn: true });
      window.gapi.signin2.render('g-signin2', {
        onsuccess: user => {
          const { id_token } = user.getAuthResponse();
          fetch(
            'https://ec2-54-234-114-228.compute-1.amazonaws.com:8081/oauth/google/token',
            {
              headers: {
                'content-type': 'application/json',
                id_token,
              },
            },
          )
            .then(r => r.text())
            .then(token => {
              const decoded = decode(token);

              console.log(decoded);

              const projectMap = {
                AWG_Kidney: ['TCGA-KIRC', 'TCGA-KIRP', 'TCGA-KICH'],
                AWG_Brain: ['TCGA-LGG', 'TCGA-GBM'],
              };

              let project_ids = flatMap(
                decoded.context.user.groups
                  .map(group => projectMap[group])
                  .filter(Boolean),
              );

              this.props.dispatch({
                type: 'gdc/USER_SUCCESS',
                payload: {
                  username: `${decoded.context.user.first_name} ${decoded
                    .context.user.last_name}`,
                },
                project_ids,
              });
            });
        },
      });
    };
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
            <h1>Welcome to the GDC - AWG Portal</h1>

            {this.props.user &&
              !this.props.project_ids.length && (
                <div>
                  <br />
                  <br />You don't have access to any projects
                </div>
              )}

            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                id="g-signin2"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              />{' '}
              <Aux>
                <img
                  style={{
                    marginTop: '-7px',
                    marginLeft: '20px',
                    cursor: 'pointer',
                    boxShadow:
                      '0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3)',
                    width: '50px',
                    height: '50px',
                    padding: '10px',
                    borderRadius: '100%',
                  }}
                  src="https://blog.addthiscdn.com/wp-content/uploads/2015/11/logo-facebook.png"
                />
              </Aux>
            </div>
          </div>
        </div>
      );
    }
  },
);
