import React from 'react';
import ExternalLinkIcon from 'react-icons/lib/fa/external-link';

export default function ExternalLink({
  children,
  hasExternalIcon = true,
  className = '',
  ...props
}): React.Element {
  return (
    <a
      {...props}
      className={`${className} test-external-link`}
      rel="noopener noreferrer"
      target="_blank">
      {hasExternalIcon && (
        <ExternalLinkIcon style={{ marginRight: '0.5rem' }} />
      )}
      {children}
    </a>
  );
}
