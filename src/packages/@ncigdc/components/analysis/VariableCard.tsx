import React from 'react';
import { compose } from 'recompose';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { zDepth1 } from '@ncigdc/theme/mixins';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import Dropdown from '@ncigdc/uikit/Dropdown';
import { CloseIcon, SurvivalIcon, BarChartIcon } from '@ncigdc/theme/icons';
import { withTheme } from '@ncigdc/theme';
import { IThemeProps } from '@ncigdc/theme/versions/active';
/* tslint:disable */
interface ITableHeading {
  key: string;
  title: string;
  style?: React.CSSProperties;
}

interface IVariableProps {
  label: string;
  data: any[];
  plots: any[];
  variableHeadings: ITableHeading[];
  actions: any[];
  style: React.CSSProperties;
  theme: IThemeProps;
}

interface IVizButton {
  type: string;
  title: string;
  icon: JSX.Element;
}

const vizButtons: IVizButton[] = [
  {
    type: 'survival',
    title: 'Survival Plot',
    icon: <SurvivalIcon />,
  },
  {
    type: 'bar_chart',
    title: 'Bar Chart',
    icon: <BarChartIcon />,
  },
  // {
  //   type: 'histogram',
  //   title: 'Histogram',
  //   icon: <HistogramIcon />,
  // },
  {
    type: 'delete',
    title: 'Delete Card',
    icon: <CloseIcon />,
  },
];

const enhance = compose(withTheme);

const VariableCard: React.ComponentType<IVariableProps> = ({
  label,
  data,
  plots,
  variableHeadings,
  actions,
  style = {},
  theme,
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
        <h2 style={{ fontSize: '1.8rem' }}>{label}</h2>
        <Row>
          {/* {[...actions, 'close'].map(a => { */}
          {vizButtons.map(a => {
            return (
              <Tooltip key={a.type} Component={a.title}>
                <Button
                  style={{
                    margin: 2,
                    ...(a.type === 'delete' ? { ...visualizingButton } : {}),
                    ...(a.type === 'survival'
                      ? { minWidth: 40, minHeight: 28 }
                      : {}),
                  }}
                >
                  {a.icon}
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
            <Button style={visualizingButton} rightIcon={<DownCaretIcon />}>
              Select an action
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
