import React from 'react';
import HistogramCard from '@ncigdc/components/Explore/SummaryElements/HistogramCard';
import SampleTypeCard from '@ncigdc/components/Explore/SummaryElements/SampleTypeCard';

const data = [
  {
    count: 1800,
    id: 'FM-AD',

  },
  {
    count: 1120,
    id: 'TARGET-NBL',

  },
  {
    count: 1098,
    id: 'TCGA-BRCA',

  },
  {
    count: 995,
    id: 'MMRF-COMMPASS',

  },
  {
    count: 988,
    id: 'TARGET-AML',

  },

];
const data2 = data.map(d => ({
  label: d.id,
  value: d.count,
}));
const summaryElements = [
  {
    component: <SampleTypeCard data={data} />,
    size: 1,
  },
  {
    component: <HistogramCard data={data2} xAxisTitle="text" />,
    size: 1,
  },
  {
    component: '',
    size: 1,
  },
  {
    component: <HistogramCard data={data2} xAxisTitle="text" />,
    size: 1,
  },
  {
    component: '',
    size: 2,
  },
  {
    component: <HistogramCard data={data2} xAxisTitle="text" />,
    size: 1,
  },
  {
    component: <HistogramCard data={data2} xAxisTitle="text" />,
    size: 1,
  },
  {
    component: <HistogramCard data={data2} xAxisTitle="text" />,
    size: 1,
  },
  {
    component: '',
    size: 3,
  },
];

export default summaryElements;
