import React from 'react';
import { connect } from 'react-redux';
import { head } from 'lodash';
import {
  branch,
  compose,
  lifecycle,
  setDisplayName,
  withProps,
} from 'recompose';
import withRouter from '@ncigdc/utils/withRouter';
import ClinicalAnalysisResult from '@ncigdc/modern_components/ClinicalAnalysis';

import { CLINICAL_BLACKLIST } from '@ncigdc/utils/constants';

const validClinicalTypesRegex = /(demographic)|(diagnoses)|(exposures)|(treatments)|(follow_ups)/;
const blacklistRegex = new RegExp(
  CLINICAL_BLACKLIST.map(item => `(${item})`).join('|')
);

const ClinicalAnalysisContainer = ({
  clinicalAnalysisFields,
  ...props
}) => (
  <ClinicalAnalysisResult
    clinicalAnalysisFields={clinicalAnalysisFields}
    {...props}
    />
);

export default compose(
  setDisplayName('EnhancedClinicalAnalysisContainer'),
  withRouter,
  connect((state: any, props: any) => ({
    currentAnalysis: state.analysis.saved.find(a => a.id === props.id),
  })),
  branch(
    ({ currentAnalysis }) => !currentAnalysis,
    ({ push }) => push({ pathname: '/analysis' })
  ),
  withProps(({ __type: { fields } }) => {
    const filteredFields = head(
      fields.filter(field => field.name === 'aggregations')
    ).type.fields;

    return {
      clinicalAnalysisFields: filteredFields
        .filter(field => validClinicalTypesRegex.test(field.name))
        .filter(field => !blacklistRegex.test(field.name)),
    };
  }),
  lifecycle({
    shouldComponentUpdate({
      id: nextId,
      loading: nextLoading,
    }) {
      const {
        id,
        loading,
      } = this.props;
      return !(
        nextId === id &&
        nextLoading === loading
      );
    },
  }),
)(ClinicalAnalysisContainer);
