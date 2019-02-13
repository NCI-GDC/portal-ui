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
  updateAnalysisVariableKey,
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
    action: updateAnalysisVariableKey,
  },
  histogram: {
    title: 'Histogram',
    icon: <BarChartIcon />,
    action: updateAnalysisVariableKey,
  },
  box: {
    title: 'Box Plot',
    icon: <BoxPlot style={{ height: '1em', width: '1em' }} />,
    action: updateAnalysisVariableKey,
  },
  delete: {
    title: 'Delete Card',
    icon: <CloseIcon />,
    action: removeAnalysisVariable,
  },
};

const styles = {
  common: (theme: IThemeProps) => ({
    // backgroundColor: 'transparent',
    backgroundColor: theme.primary,
    // color: theme.greyScale2,
    color: '#fff',
    justifyContent: 'flex-start',
    ':hover': {
      // backgroundColor: theme.greyScale5,
      backgroundColor: 'rgb(0,138,224)',
    },
  }),
  downloadButton: (theme: IThemeProps) => ({
    ...styles.common(theme),
    padding: '3px 5px',
    // border: `1px solid ${theme.greyScale4}`,
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
                    ...styles.downloadButton(theme),
                    margin: 2,
                  }}
                  onClick={() =>
                    dispatch(
                      updateAnalysisVariableKey({
                        fieldName: variable.fieldName,
                        variableKey: 'active_chart',
                        value: plotType,
                        id,
                      })
                    )
                  }
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
              onChange={() => null}
              checked={true}
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
              onChange={() => null}
              checked={false}
              style={{ marginRight: 5 }}
            />
            # of Cases
          </label>
        </form>
      </Row>
      <div
        style={{
          display: 'flex',
          height: 180,
          backgroundColor: theme.greyScale5,
          margin: '5px 5px 10px',
        }}
      />
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
