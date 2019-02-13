import React from 'react';
import { compose } from 'recompose';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { zDepth1 } from '@ncigdc/theme/mixins';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import Dropdown from '@ncigdc/uikit/Dropdown';
import {
  CloseIcon,
  SurvivalIcon,
  BarChartIcon,
  BoxPlot,
} from '@ncigdc/theme/icons';
import { withTheme } from '@ncigdc/theme';
import { IThemeProps } from '@ncigdc/theme/versions/active';

import {
  removeAnalysisVariable,
  updateAnalysisVariable,
} from '@ncigdc/dux/analysis';
import { humanify } from '@ncigdc/utils/string';
import { CLINICAL_PREFIXES } from '@ncigdc/utils/constants';

interface ITableHeading {
  key: string;
  title: string;
  style?: React.CSSProperties;
}

interface IVariableProps {
  variable: any;
  data: any[];
  plots: any[];
  variableHeadings: ITableHeading[];
  actions: any[];
  style: React.CSSProperties;
  theme: IThemeProps;
  analysis: any;
  dispatch: (arg: any) => void;
  id: string;
}

interface IVizButton {
  title: string;
  icon: JSX.Element;
  action: () => void;
}

interface IVizButtons {
  survival: IVizButton;
  histogram: IVizButton;
  box: IVizButton;
  delete: IVizButton;
}

const vizButtons: IVizButtons = {
  survival: {
    title: 'Survival Plot',
    icon: <SurvivalIcon style={{ height: '1em' }} />,
    action: updateAnalysisVariable,
  },
  histogram: {
    title: 'Histogram',
    icon: <BarChartIcon style={{ height: '1em', width: '1em' }} />,
    action: updateAnalysisVariable,
  },
  box: {
    title: 'Box Plot',
    icon: <BoxPlot style={{ height: '1em', width: '1em' }} />,
    action: updateAnalysisVariable,
  },
  delete: {
    title: 'Delete Card',
    icon: <CloseIcon style={{ height: '1em', width: '1em' }} />,
    action: removeAnalysisVariable,
  },
};

const styles = {
  common: (theme: IThemeProps) => ({
    backgroundColor: 'transparent',
    color: theme.greyScale2,
    border: `1px solid ${theme.greyScale4}`,
    justifyContent: 'flex-start',
    ':hover': {
      backgroundColor: 'rgb(0,138,224)',
      color: '#fff',
      border: `1px solid rgb(0,138,224)`,
    },
  }),
  activeButton: (theme: IThemeProps) => ({
    ...styles.common(theme),
    color: '#fff',
    backgroundColor: theme.primary,
    border: `1px solid ${theme.primary}`,
  }),
};

const enhance = compose(
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme
);

const VariableCard: React.ComponentType<IVariableProps> = ({
  variable,
  data,
  plots,
  variableHeadings,
  actions,
  style = {},
  theme,
  analysis,
  dispatch,
  id,
}) => {
  return (
    <Column
      style={{
        ...zDepth1,
        border: '1px solid lightgray',
        minHeight: 200,
        margin: '0 1rem 1rem',
        padding: '0.5rem 1rem 1rem',
        ...style,
      }}
    >
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.8rem' }}>
          {humanify({
            term: variable.fieldName.replace(
              `${CLINICAL_PREFIXES[_.capitalize(variable.type)]}.`,
              ''
            ),
          })}
        </h2>
        <Row>
          {[...plots, 'delete'].map(plotType => {
            return (
              <Tooltip key={plotType} Component={vizButtons[plotType].title}>
                <Button
                  style={{
                    ...(plotType === variable.active_chart
                      ? styles.activeButton(theme)
                      : styles.common(theme)),
                    margin: 2,
                  }}
                  onClick={() => {
                    dispatch(
                      vizButtons[plotType].action({
                        fieldName: variable.fieldName,
                        variableKey: 'active_chart',
                        value: plotType,
                        id,
                      })
                    );
                  }}
                >
                  {vizButtons[plotType].icon}
                </Button>
              </Tooltip>
            );
          })}
        </Row>
      </Row>
      <Row>
        <form>
          {' '}
          <label
            htmlFor={'variable-percentage-radio'}
            style={{ marginRight: 10, fontSize: '1.2rem' }}
          >
            <input
              id={'variable-percentage-radio'}
              type={'radio'}
              value={'percentage'}
              aria-label={'% of Cases'}
              onChange={() =>
                dispatch(
                  updateAnalysisVariable({
                    fieldName: variable.fieldName,
                    variableKey: 'active_calculation',
                    value: 'percentage',
                    id,
                  })
                )
              }
              checked={variable.active_calculation === 'percentage'}
              style={{ marginRight: 5 }}
            />
            % of Cases
          </label>
          <label
            htmlFor={'variable-number-radio'}
            style={{ fontSize: '1.2rem' }}
          >
            <input
              id={'variable-number-radio'}
              type={'radio'}
              value={'number'}
              aria-label={'# of Cases'}
              onChange={() =>
                dispatch(
                  updateAnalysisVariable({
                    fieldName: variable.fieldName,
                    variableKey: 'active_calculation',
                    value: 'number',
                    id,
                  })
                )
              }
              checked={variable.active_calculation === 'number'}
              style={{ marginRight: 5 }}
            />
            # of Cases
          </label>
        </form>
      </Row>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 180,
          backgroundColor: theme.greyScale5,
          margin: '5px 5px 10px',
        }}
      >
        {variable.active_chart}
      </div>
      <Row style={{ justifyContent: 'space-between', margin: '5px 0' }}>
        <Dropdown
          button={
            <Button
              style={{ ...visualizingButton, padding: '0 12px' }}
              rightIcon={<DownCaretIcon />}
            >
              Select action
            </Button>
          }
        />
        <Button style={{ padding: '0 12px' }} rightIcon={<DownCaretIcon />}>
          Customize Bins
        </Button>
      </Row>
      <EntityPageHorizontalTable
        data={[1, 2, 3]}
        headings={[...variableHeadings, { key: 'select', title: 'Select' }]}
      />
    </Column>
  );
};

export default enhance(VariableCard);
