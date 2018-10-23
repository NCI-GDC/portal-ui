// @flow

import React from 'react';
import { get } from 'lodash';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import Tabs from '@ncigdc/uikit/Tabs';
import Link from '@ncigdc/components/Links/Link';
import { TRawQuery } from '@ncigdc/utils/uri/types';

type TTabbedLinksProps = {
  defaultIndex?: number,
  links: Array<Object>,
  queryParam: string,
  tabToolbar?: React.Element<>,
  hideTabs?: boolean,
  style?: Object,
  side?: Boolean,
  linkStyle?: Object,
  defaultContent?: React.Element<{}>,
};
type TTabbedLinks = (props: TTabbedLinksProps) => React.Element<{}>;
const TabbedLinks: TTabbedLinks = (
  {
    links,
    queryParam,
    defaultIndex = 0,
    tabToolbar,
    hideTabs,
    style,
    side,
    linkStyle = {},
    defaultContent,
  } = {},
) => (
  <LocationSubscriber>
    {(ctx: { pathname: string, query: TRawQuery }) => {
      const foundIndex = links.findIndex(
        x => x.id === (ctx.query || {})[queryParam],
      );
      const activeIndex = defaultContent
        ? foundIndex
        : foundIndex < 0 ? defaultIndex : foundIndex;

      return (
        <Tabs
          side={side}
          className="test-tabbed-links"
          style={style}
          tabToolbar={tabToolbar}
          tabStyle={{ padding: 0 }}
          tabs={
            hideTabs
              ? []
              : links.map(x => (
                  <Link
                    style={{
                      padding: '1.2rem 1.8rem',
                      textDecoration: 'none',
                      display: 'inline-block',
                      ...linkStyle,
                    }}
                    key={x.id}
                    query={{ [queryParam]: x.id }}
                    merge={x.merge || true}
                    className={'test-' + x.id}
                  >
                    {x.text}
                  </Link>
                ))
          }
          activeIndex={activeIndex}
        >
          {get(links, [activeIndex, 'component'], defaultContent)}
        </Tabs>
      );
    }}
  </LocationSubscriber>
);

export default TabbedLinks;
