// @flow
import Th from './Th';

const ThNum = ({ style, ...props }: { style?: {} }) =>
  Th({ style: { textAlign: 'right', ...style }, ...props });

export default ThNum;
