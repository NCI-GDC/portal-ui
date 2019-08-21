import React from 'react';
import { compose } from 'recompose';

import { withTheme } from '@ncigdc/theme';
import withDiseaseType from './DiseaseTypeByPrimarySite.relay';

const caseCount = 5;
const arcData = {
  name: 'Primary Sites',
  children: [
    {
      name: 'Breast',
      children: [
        {
          name: 'Disease type 1',
          size: caseCount,
        },
        {
          name: 'Disease type 2',
          size: caseCount,
        },
        {
          name: 'Disease type 3',
          size: caseCount,
        },
      ],
    },
    {
      name: 'Bronchus and lung',
      children: [
        {
          name: 'Disease type 1',
          size: caseCount,
        },
        {
          name: 'Disease type 2',
          size: caseCount,
        },
      ],
    },
    {
      name: 'Stomach',
      children: [
        {
          name: 'Disease type 1',
          size: caseCount,
        },
        {
          name: 'Disease type 2',
          size: caseCount,
        },
      ],
    },
  ],
};

const enhance = compose(withTheme);

const GetNestedData = withDiseaseType(({
  primarySite,
  viewer: {
    explore: {
      cases: {
        aggregations,
      },
    },
  },
}) => aggregations &&
  aggregations.disease_type.buckets.map(({ doc_count, key: diseaseType }) => <div key={diseaseType}>{`${primarySite} ${diseaseType}: ${doc_count}`}</div>));

const ExploreSummaryPrimarySite = ({
  viewer: {
    explore: {
      cases: {
        aggregations,
      },
    },
  },
}) => {
  return (
    <div>
      Explore Summary By Primary Site
      {aggregations && aggregations.primary_site.buckets.map(({ doc_count, key: primarySite }) => {
        return <GetNestedData key={primarySite} primarySite={primarySite} />;
      })}
    </div>
  );
};

export default enhance(ExploreSummaryPrimarySite);
