import React from 'react';
import filterCaseLimitImg from '@ncigdc/theme/images/icon-filter-case-limit.svg';
import RestrictionMessage from './RestrictionMessage';

const ControlledAccessMessage = () => (
  <RestrictionMessage
    icon={filterCaseLimitImg}
    title="This controlled dataset requires dbGaP access"
    >
    <React.Fragment>
      If you don&lsquo;t have access, follow the instructions for
      {' '}
      <a href="https://docs.gdc.cancer.gov/Data_Portal/Users_Guide/Getting_Started/#facet-filters">obtaining acess to controlled data</a>
      .
    </React.Fragment>
    <React.Fragment>
      If you have access
      {' '}
      <a href="https://docs.gdc.cancer.gov/Data_Portal/Users_Guide/Getting_Started/#facet-filters">log in to view controlled data</a>
      .
    </React.Fragment>
  </RestrictionMessage>
);

export default ControlledAccessMessage;
