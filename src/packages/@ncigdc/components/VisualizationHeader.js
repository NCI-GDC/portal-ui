// @flow
import React from 'react';

import Row from '@ncigdc/uikit/Flex/Row';
import styled from '@ncigdc/theme/styled';

type TProps = {|
  title: string,
  buttons: Array<any>,
  buttonWidth?: number,
  style?: Object,
|};

const SPACING = 10;

const Title = styled(Row, {
  textAlign: 'center',
  color: ({ theme }) => theme.greyScale2,
  fontSize: '1.4rem',
  fontWeight: 300,
  flex: 1,
  marginRight: SPACING,
  justifyContent: 'center',
  alignItems: 'center',
});

const VisualizationHeader = ({
  title,
  buttons = [],
  buttonWidth = 40,
  style,
}: TProps) => {
  const buttonsWidth =
    buttons.length * buttonWidth + SPACING * Math.max(buttons.length - 1, 0);

  return (
    <Row
      style={{ ...style, margin: '0 1.2rem' }}
      className="test-visualization-header"
    >
      <Title style={{ marginLeft: buttonsWidth + SPACING }}>
        {title}
      </Title>
      {!!buttons.length && <Row spacing={SPACING}>{buttons}</Row>}
    </Row>
  );
};

export default VisualizationHeader;
