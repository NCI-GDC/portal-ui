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
  data,
  limit = 2,
  expanded,
  toggleExpand,
  AlternateText = () => null,
  ToggleText = ({ expanded }) =>
    expanded
      ? <span>{`\u25B4 less`}</span>
      : <span>{`\u25BE ${data.length - limit} more`}</span>,
  ...props
}) =>
  <List style={style || {}} {...props}>
    {!expanded && <AlternateText />}
    {data
      .slice(0, expanded ? data.length : limit)
      .map((d, i) => <li key={i}>{d}</li>)}
    {data.length > limit &&
      <Toggle>
        <NotUnderlinedLink onClick={() => toggleExpand(v => !v)}>
          <ToggleText expanded={expanded} />
        </NotUnderlinedLink>
      </Toggle>}
  </List>;

export default withState('expanded', 'toggleExpand', false)(CollapsibleList);
