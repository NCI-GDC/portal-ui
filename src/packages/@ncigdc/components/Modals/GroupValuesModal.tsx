// @flow

import React from 'react';
import { compose, withState } from 'recompose';
import { map, groupBy, reduce } from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
// import {
//   removeClinicalAnalysisVariable,
//   updateClinicalAnalysisVariable,
// } from '@ncigdc/dux/analysis';
import OutsideClickHandler from 'react-outside-click-handler';
import EditableLabel from '@ncigdc/uikit/EditableLabel';

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
  withState('currentBins', 'setCurrentBins', ({ bins }: any) => bins.reduce((acc: any, bin: any) => ({
    ...acc,
    [bin.key]: bin.groupName,
  }), {})),
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
        <h1 style={{ margin: '20px' }}>Create Custom Bins: Something</h1>
        <h3 style={{ margin: '20px' }}>
          Organize values into groups of your choosing. Click Save Bins to udpate
          the analysis plots.
        </h3>
        <OutsideClickHandler
          onOutsideClick={() => {
            setSelectedGroupBins({});
            setSelectedHidingBins({});
          }}
          >

          <Row style={{ justifyContent: 'center' }}>
            <Column style={blockStyle}>
              Hiding Values
              <Column style={listStyle}>
                {Object.keys(currentBins)
                  .filter((bin: any) => currentBins[bin] === '')
                  .map((bin: any) => (
                    <Row
                      key={bin}
                      onClick={() => {
                        if (Object.keys(selectedGroupBins).length > 0) {
                          setSelectedGroupBins({});
                        }
                        setSelectedHidingBins({
                          ...selectedHidingBins,
                          [bin]: !selectedHidingBins[bin],
                        });
                      }}
                      style={{
                        backgroundColor: selectedHidingBins[bin] ? '#d5f4e6' : '',
                        paddingLeft: '10px',
                      }}
                      >
                      {bin}
                    </Row>
                  ))}
              </Column>
            </Column>
            <Column style={{ justifyContent: 'center' }}>
              <Button
                disabled={Object.values(selectedHidingBins).every(value => !value)}
                onClick={() => {
                  setCurrentBins({
                    ...currentBins,
                    ...reduce(selectedHidingBins, (acc, val, key) => {
                      if (val) {
                        return {
                          ...acc,
                          [key]: Object.keys(selectedHidingBins).length > 1 ? `selected value ${Object.values(currentBins).filter(bin => bin).length + 1}` : key,
                        };
                      }
                      return acc;
                    }, {}),
                  });
                  setSelectedHidingBins({});
                }}
                style={{ margin: '10px' }}
                >
                {'>>'}
              </Button>
              <Button
                disabled={Object.values(selectedGroupBins).every(value => !value)}
                onClick={() => {
                  setCurrentBins({
                    ...currentBins,
                    ...reduce(selectedGroupBins, (acc, val, key) => {
                      if (val) {
                        return {
                          ...acc,
                          [key]: '',
                        };
                      }
                      return acc;
                    }, {}),
                  });
                  setSelectedGroupBins({});
                }}
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
                    Object.keys(currentBins)
                      .filter((bin: any) => currentBins[bin] !== ''),
                    key => currentBins[key]
                  ),
                  (group: any) => (
                    <Column key={group[0]}>
                      <Row
                        key={group[0]}
                        onClick={() => {
                          if (Object.keys(selectedHidingBins).length > 0) {
                            setSelectedHidingBins({});
                          }
                          setSelectedGroupBins({
                            ...selectedGroupBins,
                            ...group.reduce((acc: any, bin: any) => ({
                              ...acc,
                              [bin]: !group.every((gbin: any) => selectedGroupBins[gbin]),
                            }), {}),
                          });
                        }}
                        style={{ backgroundColor: group.every((bin: any) => selectedGroupBins[bin]) ? '#d5f4e6' : '' }}
                        >
                        <EditableLabel
                          containerStyle={{ justifyContent: 'flex-start' }}
                          handleSave={(value: any) => setCurrentBins({
                            ...currentBins,
                            ...group.reduce((acc: any, bin: any) => ({
                              ...acc,
                              [bin]: value,
                            }), {}),
                          })
                          }
                          iconStyle={{
                            cursor: 'pointer',
                            fontSize: '1.8rem',
                            marginLeft: 10,
                          }}
                          pencilEditingOnly
                          text={currentBins[group[0]]}
                          >
                          {currentBins[group[0]]}
                        </EditableLabel>
                      </Row>
                      {group.length > 1 || group[0] !== currentBins[group[0]]
                        ? group.map((bin: any) => (
                          <Row
                            key={bin}
                            onClick={() => setSelectedGroupBins({
                              ...selectedGroupBins,
                              [bin]: !selectedGroupBins[bin],
                            })}
                            style={{
                              backgroundColor: selectedGroupBins[bin] ? '#d5f4e6' : '',
                              paddingLeft: '10px',
                            }}
                            >
                            {bin}
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
      </Column >
  )
);
