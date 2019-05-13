// @flow

import React from 'react';
import { compose, withState } from 'recompose';
import { map, groupBy } from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
// import {
//   removeClinicalAnalysisVariable,
//   updateClinicalAnalysisVariable,
// } from '@ncigdc/dux/analysis';
import OutsideClickHandler from 'react-outside-click-handler';

const styles = {
  button: {
    ...visualizingButton,
    minWidth: 100,
  },
  horizonalPadding: {
    paddingLeft: 20,
    paddingRight: 20,
  },
};

// type TOption = {
//   name: string,
// };

// type TProps = {
//   options: Array<TOption>,
//   onClose: Function,
//   selectedOptions: Array<number>,
//   setSelectedOptions: Function,
// };

const blockStyle = {
  height: '500px',
  margin: '20px',
  padding: '20px',
  width: '40%',
};

const listStyle = {
  borderRadius: '2px',
  borderStyle: 'inset',
  borderWidth: '2px',
  height: '100%',
};

export default compose(
  withState('currentBins', 'setCurrentBins', ({ bins }: any) => bins.map((bin: any) => ({
    groupName: bin.groupName,
    key: bin.key,
  }))),
  withState('selectedHidingBins', 'setSelectedHidingBins', {}),
  withState('selectedGroupBins', 'setSelectedGroupBins', {})
)(
  ({
    bins,
    currentBins,
    setCurrentBins,
    onUpdate,
    onClose,
    selectedHidingBins,
    setSelectedHidingBins,
    selectedGroupBins,
    setSelectedGroupBins,
  }: any) => (
    <Column>
        {console.log('rawQueryDatavariable', bins)}
        <h1 style={{ margin: '20px' }}>Create Custom Bins: Something</h1>
        <h3 style={{ margin: '20px' }}>
          Organize values into groups of your choosing. Click Save Bins to udpate
          the analysis plots.
        </h3>
        <OutsideClickHandler onOutsideClick={() => console.log('out of there.')}>

          <Row style={{ justifyContent: 'center' }}>
            <Column style={blockStyle}>
              Hiding Values
              <Row style={listStyle}>
                {currentBins
                  .filter((bin: any) => bin.groupName === '')
                  .map((bin: any) => (
                    <Row>
                      <input
                        readOnly
                        style={{ pointerEvents: 'none' }}
                        // aria-label={column.name}
                        type="checkbox"
                        />
                      {bin.key}
                    </Row>
                  ))}
              </Row>
            </Column>
            <Column style={{ justifyContent: 'center' }}>
              <Button
                disabled={selectedHidingBins.length === 0}
                style={{ margin: '10px' }}
                >
                {'>>'}
              </Button>
              <Button
                disabled={selectedGroupBins.length === 0}
                style={{ margin: '10px' }}
                >
                {'<<'}
              </Button>
            </Column>
            <Column style={blockStyle}>
              Display Values
              <Column style={listStyle}>
                {map(
                  groupBy(
                    currentBins.filter((bin: any) => bin.groupName !== ''),
                    'groupName'
                  ),
                  group => (
                    <Column key={group[0].groupName}>
                      {group[0].groupName}

                      {group.length > 1 || group[0].key !== group[0].groupName
                        ? group.map(bin => (
                          <Row key={bin.key} style={{ paddingLeft: '10px',
backgroundColor: '#d5f4e6' }}>
                            {bin.key}
                          </Row>
                        ))
                        : null}
                    </Column>
                  )
                )}
              </Column>
            </Column>
          </Row>
        </OutsideClickHandler>
        <Row
          spacing="1rem"
          style={{
            justifyContent: 'flex-end',
            margin: '20px',
          }}
          >
          <Button onClick={() => onClose()} style={styles.button}>
            Cancel
          </Button>
          <Button
            style={styles.button}
            >
            Save Bins
          </Button>
        </Row>
      </Column>
  )
);
