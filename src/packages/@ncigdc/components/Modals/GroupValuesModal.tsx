// @flow
/* eslint-disable */
import React, { ReactNode } from 'react';
/* eslint-enable */
import { compose, withState } from 'recompose';
import {
  map, groupBy, reduce, max,
} from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
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

interface IBinProps {
  key: string,
  /* eslint-disable */
  doc_count: number,
  /* eslint-enable */
  groupName: string,
}

interface ISelectedBinsProps {
  [x: string]: boolean
}
interface IBinsProps { [x: string]: IBinProps }
interface IGroupValuesModalProps {
  currentBins: IBinsProps,
  setCurrentBins: (currentBins: IBinsProps) => void,
  onUpdate: (bins: IBinsProps) => void,
  onClose: () => void,
  fieldName: string,
  selectedHidingBins: ISelectedBinsProps,
  setSelectedHidingBins: (selectedHidingBins: ISelectedBinsProps) => void,
  selectedGroupBins: ISelectedBinsProps,
  setSelectedGroupBins: (selectedGroupBins: ISelectedBinsProps) => void,
  editingGroupName: string,
  setEditingGroupName: (editingGroupName: string) => void,
  children?: ReactNode,
}

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
  overflow: 'scroll',
};

export default compose(
  withState('currentBins', 'setCurrentBins', ({ bins }: { bins: IBinsProps }) => bins),
  withState('selectedHidingBins', 'setSelectedHidingBins', {}),
  withState('selectedGroupBins', 'setSelectedGroupBins', {}),
  withState('editingGroupName', 'setEditingGroupName', '')
)(
  ({
    currentBins,
    setCurrentBins,
    onUpdate,
    onClose,
    fieldName,
    selectedHidingBins,
    setSelectedHidingBins,
    selectedGroupBins,
    setSelectedGroupBins,
    editingGroupName,
    setEditingGroupName,
  }: IGroupValuesModalProps) => {
    const groupNameMapping = groupBy(
      Object.keys(currentBins)
        .filter((bin: string) => currentBins[bin].groupName !== ''),
      key => currentBins[key].groupName
    );
    return (
      <Column>
        <h1 style={{ margin: '20px' }}>
          Create Custom Bins:
          {' '}
          {fieldName}
        </h1>
        <h3 style={{ margin: '20px' }}>
          Organize values into groups of your choosing. Click Save Bins to udpate
          the analysis plots.
        </h3>
        <Row style={{ justifyContent: 'center' }}>
          <Column style={blockStyle}>
            Hiding Values
            <Column style={listStyle}>
              {Object.keys(currentBins)
                .filter((binKey: string) => currentBins[binKey].groupName === '')
                .map((binKey: string) => (
                  <Row
                    key={binKey}
                    onClick={() => {
                      if (Object.keys(selectedGroupBins).length > 0) {
                        setSelectedGroupBins({});
                      }
                      setSelectedHidingBins({
                        ...selectedHidingBins,
                        [binKey]: !selectedHidingBins[binKey],
                      });
                    }}
                    style={{
                      backgroundColor: selectedHidingBins[binKey] ? '#d5f4e6' : '',
                      paddingLeft: '10px',
                    }}
                    >
                    {binKey}
                  </Row>
                ))}
            </Column>
          </Column>
          <Column style={{ justifyContent: 'center' }} >
            <Button
              disabled={Object.values(selectedHidingBins).every(value => !value)}
              onClick={() => {
                setCurrentBins({
                  ...currentBins,
                  ...reduce(selectedHidingBins, (acc, val, key) => {
                    if (val) {
                      const newGroupName = Object.keys(selectedHidingBins).length > 1
                        ? `selected value ${(max(
                          Object.keys(groupNameMapping)
                            .filter((el) => el.startsWith('selected value '))
                            .map((el) => parseInt(el.slice(15), 0))
                        ) || 0) + 1}`
                        : key;
                      setEditingGroupName(newGroupName);
                      return {
                        ...acc,
                        [key]: {
                          ...currentBins[key],
                          groupName: newGroupName,
                        },
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
                        [key]: {
                          ...currentBins[key],
                          groupName: '',
                        },
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
                groupNameMapping,
                (group: string[]) => (
                  <Column key={group[0]}>
                    <Row
                      key={group[0]}
                      onClick={() => {
                        if (Object.keys(selectedHidingBins).length > 0) {
                          setSelectedHidingBins({});
                        }
                        setSelectedGroupBins({
                          ...selectedGroupBins,
                          ...group.reduce((acc: ISelectedBinsProps, binKey: string) => ({
                            ...acc,
                            [binKey]: !group.every(
                              (binsWithSameGroupNameKey: string) => selectedGroupBins[binsWithSameGroupNameKey]
                            ),
                          }), {}),
                        });
                      }}
                      style={{ backgroundColor: group.every((binKey: string) => selectedGroupBins[binKey]) ? '#d5f4e6' : '' }}
                      >
                      <EditableLabel
                        containerStyle={{ justifyContent: 'flex-start' }}
                        handleSave={(value: string) => setCurrentBins({
                          ...currentBins,
                          ...group.reduce((acc: ISelectedBinsProps, bin: string) => ({
                            ...acc,
                            [bin]: {
                              ...currentBins[bin],
                              groupName: value,
                            },
                          }), {}),
                        })
                        }
                        iconStyle={{
                          cursor: 'pointer',
                          fontSize: '1.8rem',
                          marginLeft: 10,
                        }}
                        isEditing={currentBins[group[0]].groupName === editingGroupName}
                        pencilEditingOnly
                        text={currentBins[group[0]].groupName}
                        >
                        {currentBins[group[0]].groupName}
                      </EditableLabel>
                    </Row>
                    {group.length > 1 || group[0] !== currentBins[group[0]].groupName
                      ? group.map((bin: string) => (
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
        <Row
          spacing="1rem"
          style={{
            justifyContent: 'flex-end',
            margin: '20px',
          }}
          >
          <Button
            onClick={onClose}
            style={styles.button}
            >
            Cancel
          </Button>
          <Button
            onClick={() => onUpdate(currentBins)}
            style={styles.button}
            >
            Save Bins
          </Button>
        </Row>
      </Column>
    );
  }
);
