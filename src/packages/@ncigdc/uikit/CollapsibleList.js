// @flow
import React from 'react';
import { withState } from 'recompose';

import styled from '@ncigdc/theme/styled';

const List = styled.ul({
  listStyle: 'none',
  paddingLeft: 0,
  marginBottom: 0,
  display: 'inline-block',
});

const NotUnderlinedLink = styled.a({
  ':link': {
    textDecoration: 'none',
  },
});

const Toggle = styled.li({
  textAlign: 'right',
  fontStyle: 'italic',
  padding: '0 1rem',
  color: ({ theme }) => theme.primary,
});

const CollapsibleList = ({
  style,
  liStyle,
  toggleStyle,
  data,
  limit = 2,
  expandText = `${data.length - limit} more`,
  collapseText = 'less',
  expanded,
  toggleExpand,
  ...props
}) => (
  <List style={style || {}} {...props}>
    {data.slice(0, expanded ? data.length : limit).map((d, i) => (
      <li key={i} style={liStyle}>
        {d}
      </li>
    ))}
    {data.length > limit && (
      <Toggle style={toggleStyle}>
        <NotUnderlinedLink onClick={() => toggleExpand(v => !v)}>
          {expanded ? `\u25B4 ${collapseText}` : `\u25BE ${expandText}`}
        </NotUnderlinedLink>
      </Toggle>
    )}
  </List>
);

export default withState('expanded', 'toggleExpand', false)(CollapsibleList);
