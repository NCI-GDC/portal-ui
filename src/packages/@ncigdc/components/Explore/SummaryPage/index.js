import React from 'react';
import HistogramCard from '@ncigdc/components/Explore/SummaryPage/HistogramCard';
import SampleTypeCard from '@ncigdc/components/Explore/SummaryPage/SampleTypeCard';
import SummaryPageQuery from '@ncigdc/components/Explore/SummaryPage/SummaryPage.relay';
import MasonryLayout from '@ncigdc/components/Layouts/MasonryLayout';
import CardWrapper from '@ncigdc/components/Explore/SummaryPage/CardWrapper';
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
  const elementsData = [
    {
      component: SampleTypeCard,
      data: sampleTypeData,
      props: { mappingId: 'key' },
      space: 1,
      title: 'Sample Types',
    },
    {
      component: HistogramCard,
      data: experimentalStrategyData,
      props: {
        mappingLabel: 'key',
        mappingValue: 'doc_count',
        xAxisTitle: 'Experimental Strategy',
      },
      space: 1,
      title: 'Data Types',
    },
    {
      component: () => '',
      data: [],
      space: 1,
      title: 'Primary Sites & Disease Types',
    },
    {
      component: HistogramCard,
      data: ageAtDiagnosisData,
      props: {
        mappingLabel: 'key',
        mappingValue: 'doc_count',
        xAxisTitle: 'Age (years)',
      },
      space: 1,
      title: 'Age at Diagnosis',
    },
    {
      component: () => '',
      data: [],
      space: 2,
      title: 'Survival Analysis',
    },
    {
      component: HistogramCard,
      data: vitalStatusData,
      props: {
        mappingLabel: 'key',
        mappingValue: 'doc_count',
        xAxisTitle: 'Vital Status',
      },
      space: 1,
      title: 'Vital Status',
    },
    {
      component: HistogramCard,
      data: raceData,
      props: {
        mappingLabel: 'key',
        mappingValue: 'doc_count',
        xAxisTitle: 'Race',
      },
      space: 1,
      title: 'Race',
    },
    {
      component: HistogramCard,
      data: genderData,
      props: {
        mappingLabel: 'key',
        mappingValue: 'doc_count',
        xAxisTitle: 'Gender',
      },
      space: 1,
      title: 'Gender',
    },
    {
      component: () => '',
      data: [],
      space: 3,
      title: 'Categorical Completeness',
    },
  ];
  return (
    <MasonryLayout
      elements={elementsData.map(element => ({
        component: (
          CardWrapper({
            data: element.data,
            title: element.title,
          })(() => (
            <element.component
              data={element.data}
              {...element.props}
              />
          ))
        ),
        size: element.space,
      }))
      }
      numPerRow={numPerRow}
      />
  );
};

export default SummaryPageQuery(SummaryPage);
