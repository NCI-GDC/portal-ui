import React from 'react';
import ExternalLinkIcon from 'react-icons/lib/fa/external-link';

export default function ExternalLink({
  href, children, style, title,
}): React.Element {
  return (
    <a
      href={href}
      target="_blank"
      style={style}
      title={title}
    >
      <ExternalLinkIcon style={{ marginRight: '0.5rem' }} />
      {children}
    </a>
  );
}
