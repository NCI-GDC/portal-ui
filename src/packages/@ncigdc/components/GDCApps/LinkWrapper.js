import styled from '@ncigdc/theme/styled';
import { Row } from '@ncigdc/uikit/Flex';

export default styled(Row, {
  ' .icon': {
    fontSize: '2rem',
  },

  ' a': {
    color: '#333',
    display: 'block',
    fontSize: 'small',
    fontWeight: 'normal',
  },

  ':hover': {
    backgroundColor: '#ededed',
  },

  backgroundColor: ({ active, theme }) => (
    active ? theme.greyScale6 : 'inherit'),
  fontWeight: 'normal',
  justifyContent: 'center',
  padding: '0.5rem',
  transition: 'background 0.25s ease-in-out',
  whiteSpace: 'nowrap',
});
