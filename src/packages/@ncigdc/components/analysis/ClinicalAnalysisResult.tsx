import React from 'react';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { DownloadIcon, SaveIcon } from '@ncigdc/theme/icons';
import Hidden from '@ncigdc/components/Hidden';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { zDepth1 } from '@ncigdc/theme/mixins';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';

interface IAnalysisResultProps {
  sets: any;
  config: any;
  label: string;
  Icon: () => React.Component<any>;
}

interface IVariableProps {
  label: string;
  data: any[];
  plots: any[];
}

const VariableCard = ({ label, data, plots }: IVariableProps) => (
  <Column
    style={{
      ...zDepth1,
      border: '1px solid lightgray',
      minHeight: 200,
      margin: '0 1rem 1rem',
      minWidth: '47%',
    }}
  >
    {label}
  </Column>
);

const ClinicalAnalysisResult = ({
  sets,
  config: { name, variables },
  Icon,
  label,
}: IAnalysisResultProps) => {
  const setName = Object.values(sets.case)[0];

  return (
    <div style={{ padding: 5 }}>
      <Row
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 10,
        }}
      >
        <Row spacing={'10px'} style={{ alignItems: 'center' }}>
          <Icon style={{ height: 50, width: 50 }} />
          <Column>
            <h1 style={{ fontSize: '2.5rem', margin: '5px 5px 10px 5px' }}>
              {label}
            </h1>
            <span>
              Cases from {setName} with {name} configuration
            </span>
          </Column>
        </Row>
        <Row spacing={'5px'}>
          <Button leftIcon={<SaveIcon />}>Save Configuration</Button>
          <Tooltip Component={<span>Download</span>}>
            <Button
              style={{ ...visualizingButton, height: '100%' }}
              disabled={false}
            >
              <DownloadIcon />
              <Hidden>Download</Hidden>
            </Button>
          </Tooltip>
        </Row>
      </Row>
      <Row>
        <Column style={{ ...zDepth1, flex: 1 }}>
          <EntityPageHorizontalTable
            style={{ height: 50, borderBottom: '1px solid lightgray' }}
            data={[
              {
                cohort: Object.values(sets.case)[0],
                case_count: 400,
              },
            ]}
            headings={[
              {
                key: 'cohort',
                title: 'Cohort',
                style: { backgroundColor: '#fff' },
              },
              {
                key: 'case_count',
                title: '# Cases',
                style: { textAlign: 'right', backgroundColor: '#fff' },
              },
            ]}
          />
          <div style={{ height: 30, marginTop: 10 }}>Search</div>
          <div style={{ minHeight: 500, marginTop: 10 }}>Facet Toggle Menu</div>
        </Column>
        <Column style={{ flex: 3 }}>
          <Row style={{ ...zDepth1, margin: '0 1rem 1rem', height: 50 }}>
            Survival Analysis
          </Row>
          <Row style={{ flexWrap: 'wrap' }}>
            {' '}
            {variables.map((variable: string, i: number) => (
              <VariableCard key={i} label={variable} data={[]} plots={[]} />
            ))}
          </Row>
        </Column>
      </Row>
    </div>
  );
};

export default ClinicalAnalysisResult;
