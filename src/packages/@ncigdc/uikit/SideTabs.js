// @flow

import React from 'react';
import { withState } from 'recompose';
import { Row } from './Flex';
import Tabs from './Tabs';

const SideTabs = ({
  setTab,
  activeTab,
  tabs,
  tabContent,
  containerStyle = {},
  ...props
}) => (
  <Row flex="1" style={containerStyle}>
    <Tabs
      activeIndex={activeTab}
      onTabClick={i => setTab(() => i)}
      side
      tabs={tabs}
      {...props}>
      {tabContent.filter((x, i) => i === activeTab)}
    </Tabs>
  </Row>
);

export default withState('activeTab', 'setTab', props => props.defaultTab || 0)(
  SideTabs,
);
