// @flow
import Td from './Td';

const TdNum = ({ style, ...props }: { style?: {} }) => Td({
  style: {
    textAlign: 'right',
    ...style,
  },
  ...props,
});

export default TdNum;
