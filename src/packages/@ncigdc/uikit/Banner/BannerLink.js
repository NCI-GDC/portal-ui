import React from 'react';

import { theme } from '@ncigdc/theme';

const BannerLink = ({
  children,
  href,
  level,
}) => (
  <a
    className="banner-warning-link"
    href={href}
    style={level === 'WARNING' ? { color: theme.primaryHighContrast } : {}}
    target="blank"
    >
    {children}
  </a>
);

export default BannerLink;
