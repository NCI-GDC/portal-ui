import React from 'react';
import { withState } from 'recompose';
import { Row } from '../uikit/Flex';
import Tabs from '../uikit/Tabs';

let SideTabs = ({ setTab, activeTab, tabs, tabContent, ...props }) => {
  return (
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
};

export default withState('activeTab', 'setTab', props => props.defaultTab || 0)(SideTabs);
