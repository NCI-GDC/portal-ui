// @flow

import React from 'react';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import Tabs from '@ncigdc/uikit/Tabs';
import Link from '@ncigdc/components/Links/Link';
import type { TRawQuery } from '@ncigdc/utils/uri/types';

type TTabbedLinksProps = {
  defaultIndex?: number,
  links: [Object],
  queryParam: string,
  tabToolbar?: React.Element<>,
  hideTabs?: boolean,
};
type TTabbedLinks = (props: TTabbedLinksProps) => React.Element<{}>;
const TabbedLinks: TTabbedLinks = (
  { links, queryParam, defaultIndex = 0, tabToolbar, hideTabs } = {},
) =>
  <LocationSubscriber>
    {(ctx: {| pathname: string, query: TRawQuery |}) => {
      const foundIndex = links.findIndex(
        x => x.id === (ctx.query || {})[queryParam],
      );
      const activeIndex = foundIndex > -1 ? foundIndex : defaultIndex;

      return (
        <Tabs
          tabToolbar={tabToolbar}
          tabStyle={{ padding: 0 }}
          tabs={
            hideTabs
              ? []
              : links.map(x =>
                  <Link
                    style={{
                      padding: '1.2rem 1.8rem',
                      textDecoration: 'none',
                      display: 'inline-block',
                    }}
                    key={x.id}
                    query={{ [queryParam]: x.id }}
                    merge
                  >
                    {x.text}
                  </Link>,
                )
          }
          activeIndex={activeIndex}
        >
          {links[activeIndex].component}
        </Tabs>
      );
    }}
  </LocationSubscriber>;

export default TabbedLinks;
