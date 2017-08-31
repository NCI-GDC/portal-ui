// @flow
import reactSize from 'react-sizeme';

const withSize = (options: Object = {}) =>
  reactSize({ ...options, refreshRate: 200 });

export const WithSize = withSize()(({ children, size }) => children(size));

export default withSize;
