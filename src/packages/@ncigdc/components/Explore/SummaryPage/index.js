import React from 'react';
import HistogramCard from '@ncigdc/components/Explore/SummaryPage/HistogramCard';
import SampleTypeCard from '@ncigdc/components/Explore/SummaryPage/SampleTypeCard';
import SummaryPageQuery from '@ncigdc/components/Explore/SummaryPage/SummaryPage.relay';
import MasonryLayout from '@ncigdc/components/Layouts/MasonryLayout';
import { get } from 'lodash';

const SummaryPage = ({
  numPerRow = 3,
  viewer,
}) => {
  const genderData = get(viewer, 'explore.cases.aggregations.demographic__gender.buckets', []);
  const raceData = get(viewer, 'explore.cases.aggregations.demographic__race.buckets', []);
  const vitalStatusData = get(viewer, 'explore.cases.aggregations.demographic__vital_status.buckets', []);
  const ageAtDiagnosisData = get(viewer, 'explore.cases.aggregations.diagnoses__age_at_diagnosis.histogram.buckets', []);
  const sampleTypeData = get(viewer, 'explore.cases.aggregations.samples__sample_type.buckets', []);
  const experimentalStrategyData = get(viewer, 'explore.cases.aggregations.summary__experimental_strategies__experimental_strategy.buckets', []);
  return (
    <MasonryLayout
      elements={[
        {
          component: (<SampleTypeCard
            data={sampleTypeData.map(s => ({
              count: s.doc_count,
              id: s.key,
            }))}
            />),
          size: 1,
        },
        {
          component: (<HistogramCard
            data={experimentalStrategyData.map(e => ({
              label: e.key,
              value: e.doc_count,
            }))}
            xAxisTitle="text"
            />),
          size: 1,
        },
        {
          component: '',
          size: 1,
        },
        {
          component: (<HistogramCard
            data={ageAtDiagnosisData.map(a => ({
              label: a.key,
              value: a.doc_count,
            }))}
            xAxisTitle="text"
            />),
          size: 1,
        },
        {
          component: '',
          size: 2,
        },
        {
          component: (<HistogramCard
            data={vitalStatusData.map(v => ({
              label: v.key,
              value: v.doc_count,
            }))}
            xAxisTitle="text"
            />),
          size: 1,
        },
        {
          component: (<HistogramCard
            data={raceData.map(v => ({
              label: v.key,
              value: v.doc_count,
            }))}
            xAxisTitle="text"
            />),
          size: 1,
        },
        {
          component: (<HistogramCard
            data={genderData.map(g => ({
              label: g.key,
              value: g.doc_count,
            }))}
            xAxisTitle="text"
            />),
          size: 1,
        },
        {
          component: '',
          size: 3,
        },
      ]}
      numPerRow={numPerRow}
      />
  );
};

export default SummaryPageQuery(SummaryPage);
