import React from 'react';

import { scaleOrdinal, schemeCategory20 } from 'd3';
import { get } from 'lodash';

import HistogramCard from '@ncigdc/components/Explore/SummaryPage/HistogramCard';
import SampleTypeCard from '@ncigdc/components/Explore/SummaryPage/SampleTypeCard';
import SummaryPageQuery from '@ncigdc/components/Explore/SummaryPage/SummaryPage.relay';
import MasonryLayout from '@ncigdc/components/Layouts/MasonryLayout';
import CardWrapper from '@ncigdc/components/Explore/SummaryPage/CardWrapper';
import CategoricalCompletenessCard from '@ncigdc/components/Explore/SummaryPage/CategoricalCompletenessCard';

import PrimarySiteAndDiseaseType from '@ncigdc/modern_components/PrimarySiteAndDiseaseType';

const Tooltip = (key, count) => (
  <span>
    <b>{key}</b>
    <br />
    {`${count} Case${count > 1 ? 's' : ''}`}
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
  const sampleTypeData = get(viewer, 'repository.cases.aggregations.samples__sample_type.buckets', []);
  const experimentalStrategyData = get(viewer, 'explore.cases.aggregations.summary__experimental_strategies__experimental_strategy.buckets', []);

  const color = scaleOrdinal(schemeCategory20);
  const dataDecor = (data, name, setColor = false) => data.map((datum, i) => ({
    ...datum,
    tooltip: Tooltip(datum.key, datum.doc_count),
    ...setColor && { color: color(i) },
  }));

  const elementsData = [
    {
      component: SampleTypeCard,
      data: dataDecor(sampleTypeData, 'Sample Types', true),
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
      component: PrimarySiteAndDiseaseType,
      data: [],
      isCustomComponent: true,
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
      component: CategoricalCompletenessCard,
      data: [],
      props: {
        typeName: 'ExploreCases',
      },
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
            isCustomComponent: element.isCustomComponent,
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
