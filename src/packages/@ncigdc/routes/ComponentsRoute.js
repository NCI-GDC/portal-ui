import React from 'react';

import * as ModernComponents from '@ncigdc/modern_components';

export default class extends React.Component {
  render() {
    const Component = ModernComponents[this.props.match.params.component];
    return Component ? <Component /> : <h1>No matching component found.</h1>;
  }
}
