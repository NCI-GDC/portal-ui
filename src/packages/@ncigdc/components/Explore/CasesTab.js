// @flow

import React from 'react';
import CaseTable from '@ncigdc/containers/explore/CaseTable';
import ExploreCasesPies from '@ncigdc/components/TabPieCharts/ExploreCasesPies';

const CasesTab = props => (
  <div>
    <ExploreCasesPies aggregations={props.aggregations} />
    <CaseTable hits={props.hits} explore={props.explore} endpoint="case_ssms" />
  </div>
);

export default CasesTab;
