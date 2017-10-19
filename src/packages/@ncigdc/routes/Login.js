import React from 'react';

export default class extends React.Component {
  state = { loaded: false };
  componentDidMount() {
    window.gapi.signin2.render('g-signin2', {
      onsuccess: e => {
        console.log(123, e);
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
