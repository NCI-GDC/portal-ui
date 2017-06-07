// @flow

// Vendor
import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';

// Custom
import Tabs from '@ncigdc/uikit/Tabs';

/*----------------------------------------------------------------------------*/

const AnnotationsFacets = ({ location, Aggregations: { Cases, Files } }) => (
  <Tabs
    tabs={[
      <Link
        key="tab1"
        to={{
          pathname: '/files',
          query: { ...location.query, facetTab: 'cases' },
        }}
      >
        Cases
      </Link>,
      <Link
        key="tab2"
        to={{
          pathname: '/files',
          query: { ...location.query, facetTab: 'files' },
        }}
      >
        Files
      </Link>,
    ]}
    activeIndex={location.query.facetTab === 'cases' ? 0 : 1}
  >
    {location.query.facetTab === 'cases' ? Cases : Files}
  </Tabs>
);

AnnotationsFacets.propTypes = {
  location: PropTypes.object,
  Aggregations: PropTypes.object,
};

export default withRouter(AnnotationsFacets);
