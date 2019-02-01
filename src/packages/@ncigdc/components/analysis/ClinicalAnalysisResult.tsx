import React from 'react';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { DownloadIcon, SaveIcon } from '@ncigdc/theme/icons';
import Hidden from '@ncigdc/components/Hidden';
import { visualizingButton } from '@ncigdc/theme/mixins';

interface IAnalysisResultProps {
  sets: any;
  config: any;
  label: string;
  Icon: () => React.Component<any>;
}

const ClinicalAnalysisResult = ({
  sets,
  config: { name, variables },
  Icon,
  label,
}: IAnalysisResultProps) => {
  const setName = Object.values(sets.case)[0];

  return (
    <div>
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
      <div
        style={{
          height: 700,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        Analysis
      </div>
    </div>
  );
};

export default ClinicalAnalysisResult;
