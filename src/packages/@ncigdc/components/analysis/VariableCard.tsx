import React from 'react';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { zDepth1 } from '@ncigdc/theme/mixins';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import Dropdown from '@ncigdc/uikit/Dropdown';

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
}

const VariableCard = ({
  label,
  data,
  plots,
  variableHeadings,
  actions,
}: IVariableProps) => {
  return (
    <Column
      style={{
        ...zDepth1,
        border: '1px solid lightgray',
        minHeight: 200,
        margin: '0 1rem 1rem',
        minWidth: '40%',
        padding: '1rem',
      }}
    >
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '2rem' }}>{label}</h2>
        <Row>
          {/* {[...actions, 'close'].map(a => { */}
          {actions.map((a, i) => {
            return (
              <Tooltip key={i} Component={a}>
                <Button style={visualizingButton}>{a}</Button>
              </Tooltip>
            );
          })}
        </Row>
      </Row>
      <Row>
        <input
          type={'radio'}
          value={'percentage'}
          aria-label={'% of Cases'}
          onChange={() => null}
          checked={true}
        />
        <label>% of Cases</label>
        <input
          type={'radio'}
          value={'number'}
          aria-label={'# of Cases'}
          onChange={() => null}
          checked={false}
        />
        <label># of Cases</label>
      </Row>
      <div>Graph</div>
      <Row style={{ justifyContent: 'space-between' }}>
        <Dropdown
          button={
            <Button style={visualizingButton}>-- Select an action --</Button>
          }
        />
        <Button>Customize Bins</Button>
      </Row>
      <EntityPageHorizontalTable
        data={[1, 2, 3]}
        headings={[...variableHeadings, { key: 'select', title: 'Select' }]}
      />
    </Column>
  );
};

export default VariableCard;
