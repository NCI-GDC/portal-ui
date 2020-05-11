import React from 'react';
import Highlight from '@ncigdc/uikit/Highlight';

// Highlighting is frustratingly slow with > 100 items
const ConditionalHighlight = ({ children, condition, search }) => (condition ? (
  <Highlight search={search}>{children}</Highlight>
  ) : (
    <span>{children}</span>
  ));

export default ConditionalHighlight;
