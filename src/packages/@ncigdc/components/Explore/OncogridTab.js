// @flow

import React from 'react';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import { Column } from '@ncigdc/uikit/Flex';
import OncoGridWrapper from '@ncigdc/components/Oncogrid/OncogridWrapper';
import { parseFilterParam } from '@ncigdc/utils/uri';
import { IRawQuery } from '@ncigdc/utils/uri/types';

const styles = {
  heading: {
    flexGrow: 1,
    fontSize: '2rem',
    marginBottom: 7,
    marginTop: 7,
  },
  card: {
    backgroundColor: 'white',
  },
};

export default props => (
  <Column style={{ ...styles.card, position: 'static' }}>
    <h1 style={{ ...styles.heading, padding: '1rem' }} id="oncogrid">
      <i className="fa fa-th" style={{ paddingRight: '10px' }} />
      OncoGrid
    </h1>

    <LocationSubscriber>
      {(ctx: { pathname: string, query: IRawQuery }) => {
        const { filters } = ctx.query || {};
        const currentFilters = parseFilterParam(filters, { content: [] });
        return (
          <OncoGridWrapper
            currentFilters={currentFilters}
            width={window.innerWidth}
          />
        );
      }}
    </LocationSubscriber>
  </Column>
);
