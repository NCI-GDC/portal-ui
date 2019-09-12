import React from 'react';
import PieChart from '@ncigdc/components/Charts/PieChart';
import * as d3 from 'd3';

const color = d3.scaleOrdinal(d3.schemeCategory20);

const SampleTypeCard = ({ data, mappingId }) => (
  // <div
  //   style={{
  //     alignItems: 'center',
  //     display: 'flex',
  //     flexDirection: 'row',
  //     height: '100%',
  //     justifyContent: 'center',
  //     width: '100%',
  //   }}
    // >
  <PieChart
    data={data}
    enableInnerRadius
    height={280}
    mappingId={mappingId}
    marginTop={30}
    path="doc_count"
    width={280}
    />
  // </div>
);
export default SampleTypeCard;
