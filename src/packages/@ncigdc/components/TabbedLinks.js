// @flow

import React from 'react';
import { get } from 'lodash';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import Tabs from '@ncigdc/uikit/Tabs';
import Link from '@ncigdc/components/Links/Link';

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
    {(ctx: { pathname: string, query: IRawQuery }) => {
      const foundIndex = links.findIndex(
        x => x.id === (ctx.query || {})[queryParam],
      );
      const activeIndex = defaultContent
        ? foundIndex
        : foundIndex < 0 ? defaultIndex : foundIndex;

      return (
        <Tabs
          activeIndex={activeIndex}
          className="test-tabbed-links"
          side={side}
          style={style}
          tabs={
            hideTabs
              ? []
              : links.map(({
                filters = null, id, merge, text,
              }) => {
                return (
                  <Link
                    className={`test-${id}`}
                    key={id}
                    merge={merge || true}
                    query={{
                      filters,
                      [queryParam]: id,
                    }}
                    style={{
                      display: 'inline-block',
                      padding: '1.2rem 1.8rem',
                      textDecoration: 'none',
                      ...linkStyle,
                    }}
                    >
                    {text}
                  </Link>
                );
              })
          }
          tabStyle={{ padding: 0 }}
          tabToolbar={tabToolbar}
          >
          {get(links, [activeIndex, 'component'], defaultContent)}
        </Tabs>
      );
    }}
  </LocationSubscriber>
);

export default TabbedLinks;
