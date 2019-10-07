import React from 'react';
import { get } from 'lodash';

import HistogramCard from '@ncigdc/components/Explore/SummaryPage/HistogramCard';
import SampleTypeCard from '@ncigdc/components/Explore/SummaryPage/SampleTypeCard';
import SummaryPageQuery from '@ncigdc/components/Explore/SummaryPage/SummaryPage.relay';
import MasonryLayout from '@ncigdc/components/Layouts/MasonryLayout';
import CardWrapper from '@ncigdc/components/Explore/SummaryPage/CardWrapper';
import PrimarySiteAndDiseaseType from '@ncigdc/modern_components/PrimarySiteAndDiseaseType';
import SurvivalAnalysisCard from '@ncigdc/components/Explore/SummaryPage/SurvivalAnalysisCard';

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
      {count > 1 ? 's' : ''}
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
  const dataDecor = (data, name) => data.map(el => ({
    ...el,
    tooltip: Tooltip(name, el.key, el.doc_count),
  }));


  const elementsData = [
    {
      component: SampleTypeCard,
      data: dataDecor(sampleTypeData, 'Sample Types'),
      props: { mappingId: 'key' },
      space: 1,
      title: 'Sample Types',
    },
    {
      component: HistogramCard,
      data: dataDecor(experimentalStrategyData, 'Data Types'),
      props: {
        mappingLabel: 'key',
        mappingValue: 'doc_count',
        xAxisTitle: 'Experimental Strategy',
      },
      space: 1,
      title: 'Data Types',
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
      component: SurvivalAnalysisCard,
      data: [],
      hideDownloadButton: true,
      space: 1,
      title: 'Overall Survival',
    },
    {
      component: () => '',
      data: [],
      space: 1,
      title: 'Treatment Type',
    },
    {
      component: HistogramCard,
      data: dataDecor(vitalStatusData, 'Vital Status'),
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
      data: dataDecor(raceData, 'Race'),
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
      data: dataDecor(genderData, 'Gender'),
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
            Component: element.component,
            data: element.data,
            hideDownloadButton: element.hideDownloadButton,
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
