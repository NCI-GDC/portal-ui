import React from 'react';
import { compose } from 'recompose';
import { Tooltip } from '@ncigdc/uikit/Tooltip/index';
import Button from '@ncigdc/uikit/Button';
import withRouter from '@ncigdc/utils/withRouter';

const enhance = compose(withRouter);

const DemoButton = ({ demoData, type, push, style }) => {
  const onDemo = type => {
    push({
      query: {
        analysisTableTab: 'result',
        analysisId: `demo-${type}`,
      },
    });
  };

  return (
    <Tooltip
      style={style}
      Component={
        demoData && <div style={{ maxWidth: 240 }}>{demoData.message}</div>
      }
    >
      <Button onClick={() => demoData && onDemo(type)}>Demo</Button>
    </Tooltip>
  );
};

export default enhance(DemoButton);
