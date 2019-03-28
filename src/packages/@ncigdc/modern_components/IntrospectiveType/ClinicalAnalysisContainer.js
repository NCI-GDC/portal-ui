import React from 'react';
import ClinicalAnalysisResult from '@ncigdc/modern_components/ClinicalAnalysis';
import { compose, withProps } from 'recompose';

import { CLINICAL_BLACKLIST } from '@ncigdc/utils/constants';

const validClinicalTypesRegex = /(demographic)|(diagnoses)|(exposures)|(treatments)|(follow_ups)/;
const blacklistRegex = new RegExp(
  CLINICAL_BLACKLIST.map(item => `(${item})`).join('|')
);

const enhance = compose(
  withProps(({ __type: { fields, name } }) => {
    const filteredFields = _.head(
      fields.filter(field => field.name === 'aggregations')
    ).type.fields;

    const clinicalAnalysisFields = filteredFields
      .filter(field => validClinicalTypesRegex.test(field.name))
      .filter(field => !blacklistRegex.test(field.name));
    return { clinicalAnalysisFields };
  })
);

const ClinicalAnalysisContainer = ({
  clinicalAnalysisFields,
  currentAnalysis,
  ...props
}) => {
  return (
    <ClinicalAnalysisResult
      clinicalAnalysisFields={clinicalAnalysisFields}
      {...props}
    />
  );
};

export default enhance(ClinicalAnalysisContainer);
