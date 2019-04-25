import styled from '@ncigdc/theme/styled';
import { Row } from '@ncigdc/uikit/Flex';

export default styled(Row, {
  whiteSpace: 'nowrap',
  display: 'inline !important',
  padding: '0.5rem',
  margin: '0.25rem',
  transition: 'background 0.25s ease-in-out',
  fontWeight: 'normal',
  backgroundColor: ({ theme, active }) => (active ? theme.greyScale6 : 'inherit'),
  ' a': {
    color: '#333',
    fontWeight: 'normal',
    fontSize: 'small',
    display: 'block',
  },
  ' .icon': {
    fontSize: '2rem',
  },
  ':hover': {
    backgroundColor: '#ededed',
  },
});
