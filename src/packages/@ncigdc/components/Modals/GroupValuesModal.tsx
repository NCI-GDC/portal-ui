// @flow
/* eslint-disable */
import React, { ReactNode } from 'react';
/* eslint-enable */
import { compose, withState, withProps } from 'recompose';
import {
  map, groupBy, reduce, filter,
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

const initialName = (arr: string[], prefix: string) => {
  /* @arr is the list of names
     @ prefix is the prefix for the name
     This function is to generate initial name for new file/list/element name.
     e.g: if the arr is["new name 1", "new name 3", "apple", "banana"], prefix is "new name ".
     Then the return value will be "new name 2".
     */
  const numberSet = new Set(arr);
  for (let i = 1; i <= arr.length + 1; i += 1) {
    if (!numberSet.has(prefix + i)) {
      return prefix + i;
    }
  }
  return prefix + arr.length + 1;
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
  binGrouping: () => void,
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
  warning: string,
  setWarning: (warning: string) => void,
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
  withState('editingGroupName', 'setEditingGroupName', ''),
  withState('currentBins', 'setCurrentBins', ({ bins }: { bins: IBinsProps }) => bins),
  withState('selectedHidingBins', 'setSelectedHidingBins', {}),
  withState('selectedGroupBins', 'setSelectedGroupBins', {}),
  withState('warning', 'setWarning', ''),
  withProps(({
    currentBins,
    selectedGroupBins,
    setCurrentBins,
    setEditingGroupName,
    setSelectedHidingBins,
  }: any) => ({
    binGrouping: async () => {
      const newGroupName = initialName(
        Object.values(currentBins).map((bin: IBinProps) => bin.groupName), 'selected Value '
      );
      setEditingGroupName(newGroupName);
      setCurrentBins({
        ...currentBins,
        ...reduce(selectedGroupBins, (acc, val, key) => {
          if (val) {
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
    },
  }))
)(
  ({
    binGrouping,
    currentBins,
    editingGroupName,
    fieldName,
    onClose,
    onUpdate,
    selectedGroupBins,
    selectedHidingBins,
    setCurrentBins,
    setEditingGroupName,
    setSelectedGroupBins,
    setSelectedHidingBins,
    setWarning,
    warning,
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
          Organize values into groups of your choosing. Click Save Bins to update the analysis plots.
        </h3>
        <Row style={{ justifyContent: 'center' }}>
          <Column style={blockStyle}>
            <span style={{ height: '54px' }}>Hiding Values</span>
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
                      const newGroupName = initialName(
                        Object.values(currentBins).map((bin: IBinProps) => bin.groupName), 'selected Value '
                      );
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
                if (filter(selectedGroupBins, bin => bin).length ===
                  Object.keys(currentBins).length) {
                  setWarning('Leave at least one bin.');
                  return;
                }
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
            <Row style={{ justifyContent: 'space-between' }}>
              <span style={{
                alignItems: 'center',
                display: 'flex',
              }}
                    >
                Display Values

              </span>
              <Button
                disabled={Object.values(selectedGroupBins).filter(value => value).length < 2}
                onClick={binGrouping}
                style={{
                  float: 'right',
                  margin: '10px',
                }}
                >
                {'Group'}
              </Button>
            </Row>
            <Column style={listStyle}>
              {map(
                groupNameMapping,
                (group: string[], groupName: string) => (
                  <Column key={groupName}>
                    <Row
                      key={groupName}
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
                      {group.length > 1 || group[0] !== groupName
                        ? (
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
                            isEditing={editingGroupName === groupName}
                            pencilEditingOnly
                            text={groupName}
                            >
                            {groupName}
                          </EditableLabel>
                        ) : currentBins[group[0]].key}
                    </Row>
                    {group.length > 1 || group[0] !== groupName
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
          <span style={{
            color: 'red',
            justifyContent: 'flex-start',
            visibility: warning.length > 0 ? 'visible' : 'hidden',
          }}
                >
            {'Warning: '}
            {warning}
          </span>
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
      </Column >
    );
  }
);