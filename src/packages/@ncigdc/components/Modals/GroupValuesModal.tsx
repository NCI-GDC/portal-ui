// @flow
/* eslint-disable */
import React, { ReactNode } from 'react';
/* eslint-enable */
import {
  compose,
  withState,
  withProps,
  setDisplayName,
} from 'recompose';
import {
  map, groupBy, reduce, filter, some,
} from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import ControlEditableRow from '@ncigdc/uikit/ControlEditableRow';

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
  dataBuckets: IBinProps[],
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
  globalWarning: string,
  setGlobalWarning: (globalWarning: string) => void,
  setListWarning: (listWarning: { [x: string]: string }) => void,
  listWarning: { [x: string]: string },
}

const blockStyle = {
  height: '500px',
  width: '45%',
};

const listStyle = {
  borderRadius: '2px',
  borderStyle: 'inset',
  borderWidth: '2px',
  height: '100%',
  overflow: 'scroll',
};

const buttonStyle = {
  float: 'right',
  margin: '10px 2px 10px 3px',
};

const GroupValuesModal = ({
  binGrouping,
  currentBins,
  dataBuckets,
  editingGroupName,
  fieldName,
  globalWarning,
  listWarning,
  onClose,
  onUpdate,
  selectedGroupBins,
  selectedHidingBins,
  setCurrentBins,
  setGlobalWarning,
  setListWarning,
  setSelectedGroupBins,
  setSelectedHidingBins,
}: IGroupValuesModalProps) => {
  const groupNameMapping = groupBy(
    Object.keys(currentBins)
      .filter((bin: string) => currentBins[bin].groupName !== ''),
    key => currentBins[key].groupName
  );

  return (
    <Column
      style={{
        padding: '2.5rem',
      }}
      >
      <h1 style={{ margin: '0 0 1.8rem' }}>
        Create Custom Bins:
        {' '}
        {fieldName}
      </h1>
      <h3 style={{ margin: '0 0 1.8rem' }}>
        Organize values into groups of your choosing. Click Save Bins to udpate
        the analysis plots.
      </h3>
      <Row style={{ justifyContent: 'space-between' }}>
        <Column style={blockStyle}>
          <Row style={{ justifyContent: 'space-between' }}>
            <div style={{
              alignItems: 'flex-end',
              display: 'flex',
              height: '54px',
            }}
                 >
              Hidden Values
            </div>
          </Row>
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
                  {`${binKey} (${currentBins[binKey].doc_count})`}
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
                    return {
                      ...acc,
                      [key]: {
                        ...currentBins[key],
                        groupName: key,
                      },
                    };
                  }
                  return acc;
                }, {}),
              });
              setSelectedHidingBins({});
              setGlobalWarning('');
              setListWarning({});
            }}
            style={{ margin: '10px' }}
            >
            {'>>'}
          </Button>
          <Button
            disabled={Object.values(selectedGroupBins).every(value => !value)}
            onClick={() => {
              if (filter(selectedGroupBins, Boolean).length ===
                Object.keys(filter(currentBins, (bin: IBinProps) => !!bin.groupName)).length) {
                setGlobalWarning('Leave at least one bin.');
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
              setGlobalWarning('');
              setListWarning({});
            }}
            style={{ margin: '10px' }}
            >
            {'<<'}
          </Button>
        </Column>
        <Column style={blockStyle}>
          <Row style={{ justifyContent: 'space-between' }}>
            <span style={{
              alignItems: 'flex-end',
              display: 'flex',
            }}
                  >
              Displayed Values

            </span>
            <Row>
              <Button
                onClick={() => {
                  setCurrentBins({
                    ...dataBuckets.reduce((acc, r) => ({
                      ...acc,
                      [r.key]: {
                        ...r,
                        groupName: r.key,
                      },
                    }), {}),
                  });
                  setSelectedGroupBins({});
                  setGlobalWarning('');
                  setListWarning({});
                }}
                style={buttonStyle}
                >
                {'Reset'}
              </Button>
              <Button
                disabled={Object
                  .keys(selectedGroupBins)
                  .filter(key => selectedGroupBins[key])
                  .every(key => currentBins[key].groupName === key)}
                onClick={() => {
                  setCurrentBins({
                    ...currentBins,
                    ...reduce(selectedGroupBins, (acc, val, key) => {
                      if (val) {
                        return {
                          ...acc,
                          [key]: {
                            ...currentBins[key],
                            groupName: key,
                          },
                        };
                      }
                      return acc;
                    }, {}),
                  });
                  setSelectedGroupBins({});
                  setGlobalWarning('');
                  setListWarning({});
                }}
                style={buttonStyle}
                >
                {'Ungroup'}
              </Button>
              <Button
                disabled={Object.values(selectedGroupBins).filter(Boolean).length < 2}
                onClick={() => {
                  binGrouping();
                  setSelectedGroupBins({});
                  setGlobalWarning('');
                  setListWarning({});
                }}
                style={buttonStyle}
                >
                {'Group'}
              </Button>
            </Row>
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
                    style={{
                      backgroundColor: group.every((binKey: string) => selectedGroupBins[binKey]) ? '#d5f4e6' : '',


                    }}
                    >
                    {group.length > 1 || group[0] !== groupName
                      ? (
                        <ControlEditableRow
                          cleanWarning={() => setListWarning({})}
                          containerStyle={{
                            justifyContent: 'flex-start',
                          }}
                          disableOnKeyDown={listWarning[groupName]}
                          handleSave={(value: string) => {
                            if (listWarning[groupName]) {
                              return 'unsave';
                            }
                            setCurrentBins({
                              ...currentBins,
                              ...group.reduce((acc: ISelectedBinsProps, bin: string) => ({
                                ...acc,
                                [bin]: {
                                  ...currentBins[bin],
                                  groupName: value,
                                },
                              }), {}),
                            });
                            setGlobalWarning('');
                            setListWarning({});
                            setSelectedGroupBins({});
                            return null;
                          }
                          }
                          iconStyle={{
                            cursor: 'pointer',
                            fontSize: '1.8rem',
                            marginLeft: 10,
                          }}
                          isEditing={editingGroupName === groupName}
                          noEditingStyle={{ fontWeight: 'bold' }}
                          onEdit={(value: string) => {
                            if (value.trim() === '') {
                              setListWarning({
                                ...listWarning,
                                [groupName]: 'Can not be empty.',
                              });
                            } else if (
                              some(currentBins,
                                   (bin: IBinProps) => bin.groupName.trim() === value.trim()) &&
                              groupName.trim() !== value.trim()
                            ) {
                              setListWarning({
                                ...listWarning,
                                [groupName]: `"${value.trim()}" already exists.`,
                              });
                            } else if (group.includes(value)) {
                              setListWarning({
                                ...listWarning,
                                [groupName]: 'Group name can\'t be the same as one of values.',
                              });
                            } else {
                              setListWarning({});
                            }
                          }}
                          text={groupName}
                          warning={listWarning[groupName]}
                          >
                          {groupName}
                        </ControlEditableRow>
                      ) : (
                        <div style={{ fontWeight: 'bold' }}>
                          {`${currentBins[group[0]].key} (${currentBins[group[0]].doc_count})`}
                        </div>
                      )
                    }
                  </Row>
                  {
                    group.length > 1 || group[0] !== groupName
                      ? group.map((bin: string) => (
                        <Row
                          key={bin}
                          onClick={() => {
                            setSelectedGroupBins({
                              ...selectedGroupBins,
                              [bin]: !selectedGroupBins[bin],
                            });
                          }

                          }
                          style={{
                            backgroundColor: selectedGroupBins[bin] ? '#d5f4e6' : '',
                            display: 'list-item',
                            listStylePosition: 'inside',
                            listStyleType: 'disc',
                            paddingLeft: '5px',
                          }}
                          >
                          {`${bin} (${currentBins[bin].doc_count})`}
                        </Row>
                      ))
                      : null
                  }
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
          marginTop: '1.8rem',
        }}
        >
        {globalWarning.length > 0 ? (
          <span style={{
            color: 'red',
            justifyContent: 'flex-start',
          }}
                >
            {'Warning: '}
            {globalWarning}
          </span>
        ) : null}
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
};

export default compose(
  setDisplayName('EnhancedGroupValuesModal'),
  withState('editingGroupName', 'setEditingGroupName', ''),
  withState('currentBins', 'setCurrentBins', ({ bins }: { bins: IBinsProps }) => bins),
  withState('selectedHidingBins', 'setSelectedHidingBins', {}),
  withState('selectedGroupBins', 'setSelectedGroupBins', {}),
  withState('globalWarning', 'setGlobalWarning', ''),
  withState('listWarning', 'setListWarning', {}),
  withProps(({
    currentBins,
    selectedGroupBins,
    setCurrentBins,
    setEditingGroupName,
    setSelectedHidingBins,
  }) => ({
    binGrouping: () => {
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
)(GroupValuesModal);
