import React from 'react';
import styled from '@ncigdc/theme/styled';
import { Row } from '@ncigdc/uikit/Flex';

// const style = {
//   border: '1px solid #C4D9EA',
//   borderRadius: 5,
// };

// const DescriptionWrapper = styled.div`
//   position: relative,
//   &:before: {
//     color: magenta,
//     content: "\f061",
//     display: block,
//     fontFamily: FontAwesome,
//     position: absolute,
//   }
// `;

const DescriptionWrapper = styled(Row, {
  ':hover': {
    textDecoration: 'underline',
  },
  color: ({ theme }) => theme.secondaryHighContrast,
  cursor: 'pointer',
  padding: '0.3rem 0.6rem',
});

const CaseLimitMessage = ({
  children,
  icon,
  title,
}) => (
  <div>
    <p>{icon}</p>
    <p>{title}</p>
    <DescriptionWrapper>
      {children}
    </DescriptionWrapper>
  </div>
);

export default CaseLimitMessage;
