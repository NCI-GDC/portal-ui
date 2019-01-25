import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { Row, Column } from '@ncigdc/uikit/Flex';

type TProps = {
  onCancel: Function,
  onRun: Function,
  type: string,
  label: string,
  Icon: Function,
  description: string,
  demoData: any,
  setInstructions: string,
  setDisabledMessage: Function,
  setTypes: any,
  validateSets: any,
  ResultComponent: () => React.ReactComponent,
};
const SelectClinicalAnalysis = ({ onCancel, onRun, type }: TProps) => {
  return <Column>{type}</Column>;
};

export default SelectClinicalAnalysis;
