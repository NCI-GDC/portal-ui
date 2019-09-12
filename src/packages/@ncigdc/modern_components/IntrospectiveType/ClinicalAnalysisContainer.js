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
import testValidClinicalTypes from '@ncigdc/utils/clinicalBlacklist';

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
  withProps(({ introspectiveType: { fields } }) => {
    const filteredFields = head(
      fields.filter(field => field.name === 'aggregations')
    ).type.fields;

    return {
      clinicalAnalysisFields: testValidClinicalTypes(filteredFields),
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
