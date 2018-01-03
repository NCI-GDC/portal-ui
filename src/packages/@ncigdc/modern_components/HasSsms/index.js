import { get } from 'lodash';
import withData from './HasSsms.relay';

export default withData(
  p => (get(p, 'viewer.explore.ssms.hits.total', 0) ? p.children : null),
);
