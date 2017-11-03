// @flow
import React from 'react';

export const internalHighlight = (query: string, foundText: string) => {
  const index = (foundText || '')
    .toLocaleLowerCase()
    .indexOf(query.toLocaleLowerCase());
  if (foundText && index !== -1) {
    const seg1 = foundText.substring(0, index);
    const foundQuery = foundText.substring(index, index + query.length);
    const seg2 = foundText.substring(index + query.length);
    return (
      <span>
        {seg1}
        <b>{foundQuery}</b>
        {seg2}
      </span>
    );
  }
  return <span>{foundText}</span>;
};

const Highlight = ({ search, children, ...props }: Object) => (
  <span>{internalHighlight(search, children)}</span>
);

export default Highlight;
