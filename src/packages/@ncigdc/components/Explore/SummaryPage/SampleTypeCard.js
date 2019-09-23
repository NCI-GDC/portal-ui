import React from 'react';
import PieChart from '@ncigdc/components/Charts/PieChart';

const SampleTypeCard = ({ data, mappingId }) => (
  <PieChart
    data={data}
    enableInnerRadius
    height={280}
    mappingId={mappingId}
    marginTop={30}
    path="doc_count"
    width={280}
    />
);
export default SampleTypeCard;
