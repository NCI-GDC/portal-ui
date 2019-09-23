import React from 'react';

import { scaleOrdinal, schemeCategory20 } from 'd3';
import HistogramCard from '@ncigdc/components/Explore/SummaryPage/HistogramCard';
import SampleTypeCard from '@ncigdc/components/Explore/SummaryPage/SampleTypeCard';
import SummaryPageQuery from '@ncigdc/components/Explore/SummaryPage/SummaryPage.relay';
import CardWrapper from '@ncigdc/components/Explore/SummaryPage/CardWrapper';
import MasonryLayout from '@ncigdc/components/Layouts/MasonryLayout';
import { get } from 'lodash';

const Tooltip = (title, key, count) => (
  <span>
    <b>
      {title}
      :
      {' '}
      {key}
      <br />
      {count.toLocaleString()}
      {' '}
      case
      {count === 1 ? '' : 's'}
    </b>
    <br />

  </span>
);
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

  const color = scaleOrdinal(schemeCategory20);
  const dataDecor = (data, name, donuts = 0) => data.map((el, i) => ({
    ...el,
    tooltip: Tooltip(name, el.key, el.doc_count),
    ...donuts === 1
      ? { color: color(i) } 
      : donuts === 2 // TODO. 'Primary Sites & Disease Types'
        ? { color: 'todo' }
        : {},
  }));

  const elementsData = [
    {
      component: SampleTypeCard,
      data: dataDecor(sampleTypeData, 'Sample Types', 1),
      props: { mappingId: 'key' },
      space: 1,
      title: 'Sample Types',
    },
    {
      component: HistogramCard,
      data: dataDecor(experimentalStrategyData, 'Experimental Strategies'),
      props: {
        mappingLabel: 'key',
        mappingValue: 'doc_count',
      },
      space: 1,
      title: 'Experimental Strategies',
    },
    {
      component: () => '',
      data: [], // TODO: donuts = 2
      space: 1,
      title: 'Primary Sites & Disease Types',
    },
    {
      component: HistogramCard,
      data: dataDecor(ageAtDiagnosisData, 'Age at Diagnosis'),
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
      data: dataDecor(vitalStatusData, 'Vital Status'),
      props: {
        mappingLabel: 'key',
        mappingValue: 'doc_count',
      },
      space: 1,
      title: 'Vital Status',
    },
    {
      component: HistogramCard,
      data: dataDecor(raceData, 'Race'),
      props: {
        mappingLabel: 'key',
        mappingValue: 'doc_count',
      },
      space: 1,
      title: 'Race',
    },
    {
      component: HistogramCard,
      data: dataDecor(genderData, 'Gender'),
      props: {
        mappingLabel: 'key',
        mappingValue: 'doc_count',
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
            Component: element.component,
            data: element.data,
            subProps: element.props,
            title: element.title,
          })
        ),
        size: element.space,
      }))
      }
      numPerRow={numPerRow}
      />
  );
};

export default SummaryPageQuery(SummaryPage);
