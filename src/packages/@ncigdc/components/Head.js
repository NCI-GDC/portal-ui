// @flow

import React from 'react';
import { capitalize } from 'lodash';
import { Helmet } from 'react-helmet';
import Favicon from '@ncigdc/theme/images/favicon.ico';

export default ({ title }) => (
  <Helmet>
    <meta
      name="description"
      content="A unique tool to foster important discoveries in Cancer Research"
    />
    <title>{capitalize(title) || 'GDC'}</title>
    <link rel="icon" href={Favicon} />
  </Helmet>
);
