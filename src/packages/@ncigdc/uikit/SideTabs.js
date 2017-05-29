// @flow

import React from 'react';
import { withState } from 'recompose';
import { Row } from './Flex';
import Tabs from './Tabs';

const SideTabs = ({ setTab, activeTab, tabs, tabContent, ...props }) => (
  <Row flex="1">
    <Tabs
      onTabClick={i => setTab(() => i)}
      tabs={tabs}
      activeIndex={activeTab}
      side
      {...props}
    >
      {tabContent.filter((x, i) => i === activeTab)}
    </Tabs>
  </Row>
  );

export default withState('activeTab', 'setTab', props => props.defaultTab || 0)(SideTabs);
