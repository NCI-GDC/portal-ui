import React from 'react';
import filterCaseLimitImg from '@ncigdc/theme/images/icon-filter-case-limit.svg';
import { MAX_CASES_API } from '@ncigdc/utils/constants';
import RestrictionMessage from './RestrictionMessage';

// TODO this needs to go somewhere else...
const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const maxCasesFormatted = numberWithCommas(MAX_CASES_API);

const ControlledAccessMessage = () => (
  <RestrictionMessage
    icon={filterCaseLimitImg}
    title="This dataset is too large to visualize"
    >
    <React.Fragment>
      Please use the
      {' '}
      <a href="https://docs.gdc.cancer.gov/Data_Portal/Users_Guide/Getting_Started/#facet-filters">filters/facets</a>
      {' '}
      on the left to reduce your dataset to
      {` ${maxCasesFormatted} `}
      cases or less.
    </React.Fragment>
  </RestrictionMessage>
);

export default ControlledAccessMessage;
