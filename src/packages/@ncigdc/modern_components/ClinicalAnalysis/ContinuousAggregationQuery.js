import React from 'react';
import {
  compose,
  withPropsOnChange,
  withProps,
  withState,
} from 'recompose';
import {
  isEqual,
  reduce,
} from 'lodash';

import { Column } from '@ncigdc/uikit/Flex';
import Spinner from '@ncigdc/uikit/Loaders/Material';
import { zDepth1 } from '@ncigdc/theme/mixins';

import { ContinuousVariableCard } from './ClinicalVariableCard';
import {
  DEFAULT_CONTINUOUS_BUCKETS,
  makeBody,
  pendingAggCache,
  simpleAggCache,
  updateData,
} from './continuous/utils';

export default compose(
  withState('aggData', 'setAggData', null),
  withState('isLoading', 'setIsLoading', 'first time'),
  withPropsOnChange(
    (props, nextProps) => 
      !(props.setIdWithData === nextProps.setIdWithData &&
      isEqual(props.variable, nextProps.variable)),
    ({
      fieldName,
      filters,
      hits,
      setAggData,
      setIsLoading,
      stats,
      variable,
    }) => {
      // TODO this update is forcing an avoidable double render
      setIsLoading(true);
      updateData({
        fieldName,
        filters,
        hits,
        setAggData,
        setIsLoading,
        stats,
        variable,
      });
    }
  ),
)(({
  aggData, hits, isLoading, setId, stats, ...props
}) => isLoading 
  ? (
   <Column
      className="clinical-analysis-card"
      style={{
        ...zDepth1,
        height: 560,
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 1rem 1rem',
      }}
      >
        <Spinner />
    </Column>
  )
  : (
    <ContinuousVariableCard
      data={{
        ...aggData,
        hits,
      }}
      setId={setId}
      stats={stats}
      {...props}
      />
  )
);
