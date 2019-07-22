// @flow
import React, { ReactNode } from 'react';
import {
  compose,
  setDisplayName,
  withProps,
  withState,
} from 'recompose';
import {
  reduce,
  filter,
  some,
  isNumber,
  min,
  map,
  find,
} from 'lodash';
import Group from '@ncigdc/theme/icons/Group';
import Hide from '@ncigdc/theme/icons/Hide';
import Show from '@ncigdc/theme/icons/Show';
import Undo from '@ncigdc/theme/icons/Undo';
import Ungroup from '@ncigdc/theme/icons/Ungroup';
import { visualizingButton } from '@ncigdc/theme/mixins';
import Button from '@ncigdc/uikit/Button';
import ControlEditableRow from '@ncigdc/uikit/ControlEditableRow';
import { Row, Column } from '@ncigdc/uikit/Flex';
import DragAndDropGroupList from '@ncigdc/uikit/DragAndDropGroupList';

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

interface IBinProps {
  key: string,
  /* eslint-disable */
  doc_count: number,
  /* eslint-enable */
  groupName: string,
  index: number,
}

interface IState {
  draggingIndex: number | null;
  items: string[];
  merged:boolean;
  prevDraggingIndex: number;
  group:any;
}

interface ISelectedBinsProps {
  [x: string]: boolean
}
interface IBinsProps { [x: string]: IBinProps }
interface IGroupValuesModalProps {
  binGrouping: (selectedGroupBins: { [x: string]: boolean }) => void,
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
  setDraggingIndex: (draggingIndex: number | null) => void,
  draggingIndex: number,
  groupNameMapping: any,
  setShift: (x: boolean) => void,
  shift: boolean,
}

const boxHeaderStyle = {
  alignItems: 'center',
  background: '#eee',
  justifyContent: 'space-between',
  padding: '0.5rem 1rem',
};

const listStyle = {
  border: '0.2rem solid #eee',
  borderRadius: '0 0 0.2rem 0.2rem',
  flexGrow: 1,
  overflow: 'scroll',
  padding: '1rem',
};

const BucketsGroupComponent = ({
  children,
  currentBins,
  editingGroupName,
  group,
  groupName,
  listWarning,
  merging,
  selectedGroupBins,
  selectedHidingBins,
  setCurrentBins,
  setEditingGroupName,
  setGlobalWarning,
  setListWarning,
  setSelectedGroupBins,
  setSelectedHidingBins,
  ...props
}: any) => (
  <Column
    group={group}
    key={groupName}
    {...props}
    >
    <Row
      onClick={() => {
        // find the first selected item in the list.

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
        backgroundColor: (group || []).every((binKey: string) => selectedGroupBins[binKey]) ? '#d5f4e6' : '',
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
              setEditingGroupName('');
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
        )
        : (
          <div style={{ fontWeight: 'bold' }}>
            {`${groupName} (${currentBins[groupName].doc_count})`}
          </div>
        )}
    </Row>
    {children}
  </Column>
);

const GroupValuesModal = ({
  binGrouping,
  currentBins,
  dataBuckets,
  draggingIndex,
  editingGroupName,
  fieldName,
  globalWarning,
  groupNameMapping,
  listWarning,
  onClose,
  onUpdate,
  selectedGroupBins,
  selectedHidingBins,
  setCurrentBins,
  setDraggingIndex,
  setEditingGroupName,
  setGlobalWarning,
  setListWarning,
  setSelectedGroupBins,
  setSelectedHidingBins,
}: IGroupValuesModalProps) => {
  return (
    <Column
      style={{
        maxHeight: '90vh',
        padding: '2rem',
      }}
      >
      <h1 style={{ margin: '0 0 1.5rem' }}>
        {`Create Custom Bins: ${fieldName}`}
      </h1>

      <h3 style={{ margin: '0 0 2rem' }}>
        Organize values into groups of your choosing. Click Save Bins to update
        the analysis plots.
      </h3>

      <Column>
        <Column
          style={{
            height: '35rem',
            marginBottom: '1.5rem',
            width: '100%',
          }}
          >
          <Row style={boxHeaderStyle}>
            <span style={{ fontWeight: 'bold' }}>Values</span>
            <Row spacing="1rem">
              <Button
                leftIcon={<Undo />}
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
                style={visualizingButton}
                />
              <Button
                disabled={Object.values(selectedGroupBins).filter(Boolean).length < 2}
                leftIcon={<Group style={{ width: '10px' }} />}
                onClick={() => {
                  binGrouping(selectedGroupBins);
                  setSelectedGroupBins({});
                  setGlobalWarning('');
                  setListWarning({});
                }}
                style={visualizingButton}
                >
                Group
              </Button>

              <Button
                disabled={Object
                  .keys(selectedGroupBins)
                  .filter(key => selectedGroupBins[key])
                  .every(key => currentBins[key].groupName === key)}
                leftIcon={<Ungroup style={{ width: '10px' }} />}
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
                style={visualizingButton}
                >
                Ungroup
              </Button>

              <Button
                disabled={Object.values(selectedGroupBins).every(value => !value)}
                leftIcon={<Hide />}
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
                style={visualizingButton}
                >
                Hide
              </Button>
            </Row>
          </Row>
          <Column style={listStyle}>
            <DragAndDropGroupList
              Component={BucketsGroupComponent}
              currentBins={currentBins}
              draggingIndex={draggingIndex}
              editingGroupName={editingGroupName}
              items={groupNameMapping}
              listWarning={listWarning}
              merging={(nextState:any) => {
                setDraggingIndex(nextState.draggingIndex);
                if (isNumber(nextState.draggingIndex)) {
                  const merged = [...nextState.targetSubItems, ...nextState.currSubItems]
                    .reduce((acc, bin) => ({
                      ...acc,
                      [bin]: true,
                    }), {});
                  binGrouping(merged);
                  setSelectedGroupBins({});
                  setGlobalWarning('');
                  setListWarning({});
                }
              }
              }
              selectedGroupBins={selectedGroupBins}
              selectedHidingBins={selectedHidingBins}
              setCurrentBins={setCurrentBins}
              setEditingGroupName={setEditingGroupName}
              setGlobalWarning={setGlobalWarning}
              setListWarning={setListWarning}
              setSelectedGroupBins={setSelectedGroupBins}
              setSelectedHidingBins={setSelectedHidingBins}
              SubComponent={({ subItem, ...props }:any) => (
                <Row
                  onClick={() => {
                    setSelectedGroupBins({
                      ...selectedGroupBins,
                      [subItem]: !selectedGroupBins[subItem],
                    });
                  }}
                  style={{
                    backgroundColor: selectedGroupBins[subItem] ? '#d5f4e6' : '',
                    display: 'list-item',
                    listStylePosition: 'inside',
                    listStyleType: 'disc',
                    paddingLeft: '5px',
                  }}
                  {...props}
                  >
                  {`${subItem} (${currentBins[subItem].doc_count})`}
                </Row>
              )
                }
              unGroup={({ key }:any) => {
                setCurrentBins({
                  ...currentBins,
                  [key]: {
                    ...currentBins[key],
                    groupName: key,
                  },
                });
                setSelectedGroupBins({});
                setGlobalWarning('');
                setListWarning({});
              }

              }
              updateState={(nextState: IState) => {
                setDraggingIndex(nextState.draggingIndex);
                if (nextState.items) {
                  const itemarr = nextState.items.reduce((acc, item, i) => ({
                    ...acc,
                    [Object.keys(item)[0]]: i,
                  }), {});
                  setCurrentBins({
                    ...reduce(currentBins, (acc, bin: IBinProps) => ({
                      ...acc,
                      [bin.key]: {
                        ...bin,
                        index: itemarr[bin.groupName],
                      },
                    }), {}),
                  });
                }
              }}
              />
          </Column>
        </Column>

        <Column
          style={{
            height: '16rem',
            width: '100%',
          }}
          >
          <Row style={boxHeaderStyle}>
            <span style={{ fontWeight: 'bold' }}>Hidden Values</span>
            <Button
              disabled={Object.values(selectedHidingBins).every(value => !value)}
              leftIcon={<Show />}
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
              style={visualizingButton}
              >
              Unhide
            </Button>
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
                  }}
                  >
                  {`${binKey} (${currentBins[binKey].doc_count})`}
                </Row>
              ))}
          </Column>
        </Column>
      </Column>

      <Row
        spacing="1rem"
        style={{
          justifyContent: 'flex-end',
          marginTop: '1.5rem',
        }}
        >
        {globalWarning.length > 0 && (
          <span
            style={{
              color: 'red',
              justifyContent: 'flex-start',
            }}
            >
            {`Warning: ${globalWarning}`}
          </span>
        )}

        <Button
          onClick={onClose}
          style={{
            ...visualizingButton,
            minWidth: 100,
          }}
          >
          Cancel
        </Button>

        <Button
          onClick={() => onUpdate(currentBins)}
          style={{
            ...visualizingButton,
            minWidth: 100,
          }}
          >
          Save Bins
        </Button>
      </Row>
    </Column>
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
  withState('draggingIndex', 'setDraggingIndex', null),
  withState('shift', 'setShift', false),
  withProps(({
    currentBins,
  }) => ({
    groupNameMapping: map(
      reduce(currentBins, (acc, bin) => {
        if (bin.groupName === '') {
          return acc;
        }
        return {
          ...acc,
          [bin.groupName]: {
            ...acc[bin.groupName],
            [bin.key]: bin.doc_count,
            index: bin.index,
          },
        };
      }, {}),
      (groupObj: any, groupName) => {
        const buckets = Object.keys(groupObj).filter(key => key !== 'index');
        return {
          [groupName]: {
            count: buckets.reduce((acc, key) => acc + groupObj[key], 0),
            index: groupObj.index,
            subList: buckets.sort((a, b) => groupObj[b] - groupObj[a]),

          },
        };
      }
    )
      .sort((a, b) => {
        const aIndex = Object.values(a)[0].index;
        const aCount = Object.values(a)[0].count;
        const bIndex = Object.values(b)[0].index;
        const bCount = Object.values(b)[0].count;
        if (isNumber(aIndex) && isNumber(bIndex)) {
          return aIndex - bIndex;
        } if (isNumber(aIndex) && !isNumber(bIndex)) {
          return -1;
        } if (!isNumber(aIndex) && isNumber(bIndex)) {
          return 1;
        }
        return bCount - aCount;
      }),
  })),
  withProps(({
    currentBins,
    groupNameMapping,
    setCurrentBins,
    setEditingGroupName,
    setSelectedHidingBins,
  }) => ({
    binGrouping: (selectedGroupBins: { [x: string]: boolean }) => {
      let newGroupName = initialName(
        Object.values(currentBins).map((bin: IBinProps) => bin.groupName), 'selected Value '
      );
      const selectedGroups =
        Object
          .keys(selectedGroupBins)
          .reduce((acc: string[], bin: string) => {
            if (selectedGroupBins[bin] && currentBins[bin].groupName !== bin) {
              const { [bin]: { groupName } } = currentBins;
              const areAllBucketsInThisGroup = find(
                groupNameMapping,
                group => Object.keys(group)[0] === groupName
              )[groupName]
                .subList.every((key: string) => selectedGroupBins[key]);
              if (!acc.includes(groupName) && areAllBucketsInThisGroup) {
                return [...acc, groupName];
              }
            }
            return acc;
          }, []);
      if (selectedGroups.length === 1) {
        [newGroupName] = selectedGroups;
      } else {
        setEditingGroupName(newGroupName);
      }
      const minIndex = min(Object.keys(selectedGroupBins).map(bin => currentBins[bin].index)) || 0;
      setCurrentBins({
        ...currentBins,
        ...reduce(selectedGroupBins, (acc, val, key) => {
          if (val) {
            return {
              ...acc,
              [key]: {
                ...currentBins[key],
                groupName: newGroupName,
                index: minIndex,
              },
            };
          }
          return acc;
        }, {}),
      });
      setSelectedHidingBins({});
    },
  })),
)(GroupValuesModal);
