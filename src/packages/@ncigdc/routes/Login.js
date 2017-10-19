import React from 'react';

export default class extends React.Component {
  state = { loaded: false };
  componentDidMount() {
    window.gapi.signin2.render('g-signin2', {
      onsuccess: user => {
        const { id_token } = user.getAuthResponse();
        console.log(id_token);
        fetch(
          'https://ec2-54-234-114-228.compute-1.amazonaws.com:8081/oauth/google/token',
          {
            headers: {
              'content-type': 'application/json',
              id_token,
            },
          },
        )
          .then(r => r.json())
          .then(json => {
            console.log('yay', json);
          });
      },
    });
  }
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
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1>AWG Login Screen</h1>
        <div id="g-signin2" />
      </div>
    );
  }
}
