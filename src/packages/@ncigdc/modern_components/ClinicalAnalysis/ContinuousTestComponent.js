import React from 'react';

class ContinuousTestComponent extends React.Component {
  componentDidMount() {
    console.log('hello world componentDidMount');
  }

  render() {
    // console.log('ContinuousTestComponent');
    return (
      <div>Hello world!</div>
    );
  }
}

export default ContinuousTestComponent;