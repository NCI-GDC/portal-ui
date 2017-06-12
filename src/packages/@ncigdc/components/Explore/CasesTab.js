// @flow

import React from 'react';
import ExploreCasesTable from '@ncigdc/modern_components/ExploreCasesTable/ExploreCasesTable';
import ExploreCasesPies from '@ncigdc/components/TabPieCharts/ExploreCasesPies';

const CasesTab = props =>
  <div>
    <ExploreCasesPies aggregations={props.pies} />
    <ExploreCasesTable />
  </div>;

export default CasesTab;
