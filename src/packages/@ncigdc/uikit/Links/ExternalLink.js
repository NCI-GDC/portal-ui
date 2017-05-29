import React from "react";
import ExternalLinkIcon from "react-icons/lib/fa/external-link";

export default function ExternalLink({
  href,
  children,
  style,
  title,
  hasExternalIcon = true
}): React.Element {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      title={title}
    >
      {hasExternalIcon &&
        <ExternalLinkIcon style={{ marginRight: "0.5rem" }} />}
      {children}
    </a>
  );
}
