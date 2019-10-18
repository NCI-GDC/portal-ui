import React from 'react';
import { capitalize } from 'lodash';
import { Helmet } from 'react-helmet';
import Favicon from '@ncigdc/theme/images/favicon.ico';

const Head = ({ title }) => (
  <Helmet>
    <meta
      content="A unique tool to foster important discoveries in Cancer Research"
      name="description"
      />
    <title>{capitalize(title) || 'GDC'}</title>
    <link href={Favicon} rel="icon" />
  </Helmet>
);

export default Head;
