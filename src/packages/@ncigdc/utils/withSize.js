// @flow
import reactSize from 'react-sizeme';

const withSize = (options: Object = {}) =>
  reactSize({ refreshRate: 200, ...options });

export const WithSize = withSize()(({ children, size }) => children(size));

export default withSize;
