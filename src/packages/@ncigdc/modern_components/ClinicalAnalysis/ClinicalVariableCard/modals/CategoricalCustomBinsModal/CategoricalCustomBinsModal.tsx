// @flow
/* eslint-disable */
import React, { ReactNode } from 'react';
/* eslint-enable */
import {
  compose,
  setDisplayName,
  withProps,
  withState,
} from 'recompose';
import {
  map,
  groupBy,
  reduce,
  filter,
  some,
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
import Hidden from '@ncigdc/components/Hidden';

import { theme } from '@ncigdc/theme/index';

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
interface ICategoricalCustomBinsModalProps {
  binGrouping: () => void,
  currentBins: IBinsProps,
  dataBuckets: IBinProps[],
  setCurrentBins: (currentBins: IBinsProps) => void,
  onUpdate: (bins: IBinsProps) => void,
  onClose: () => void,
  fieldName: string,
  groupNameMapping: () => void,
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

const styles = {
  boxHeader: {
    alignItems: 'center',
    background: '#eee',
    justifyContent: 'space-between',
    padding: '0.5rem 1rem',
  },
  disabled: {
    backgroundColor: theme.greyScale4,
    borderColor: theme.greyScale4,
    color: '#fff',
    ':hover': {
      backgroundColor: theme.greyScale4,
      borderColor: theme.greyScale4,
      color: '#fff',
    },
  },
  list: {
    border: '0.2rem solid #eee',
    borderRadius: '0 0 0.2rem 0.2rem',
    flexGrow: 1,
    overflow: 'scroll',
    padding: '1rem',
  },
}

const CategoricalCustomBinsModal = ({
  binGrouping,
  currentBins,
  dataBuckets,
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
  setGlobalWarning,
  setListWarning,
  setSelectedGroupBins,
  setSelectedHidingBins,
}: ICategoricalCustomBinsModalProps) => {
  const groupDisabled = Object.values(selectedGroupBins).filter(Boolean).length < 2
  const ungroupDisabled = Object.keys(selectedGroupBins)
    .filter(key => selectedGroupBins[key])
    .every(key => currentBins[key].groupName === key)
  const resetDisabled = Object.keys(currentBins)
    .filter(bin => currentBins[bin].key !== currentBins[bin].groupName)
    .length === 0
  const hideDisabled = Object.values(selectedGroupBins).every(value => !value)
  const showDisabled = Object.values(selectedHidingBins).every(value => !value)

  return (
    <Column
      style={{
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '2rem 2rem 0.5rem',
      }}
      >
      <h2 style={{ borderBottom: `1px solid ${theme.greyScale5}`, margin: '0 0 1.5rem', paddingBottom: '1rem' }}>
        {`Create Custom Bins: ${fieldName}`}
      </h2>

      <h3 style={{ margin: '0 0 2rem' }}>
        Organize values into groups of your choosing. Click Save Bins to update
        the analysis plots.
      </h3>

      <Column>
        <Column
          style={{
            marginBottom: '1.5rem',
            height: '35rem',
            width: '100%',
          }}
          >
          <Row style={styles.boxHeader} >
            <span style={{ fontWeight: 'bold' }} >Values</span>

            <Row spacing="1rem" >
              <Button
                disabled={resetDisabled}
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
                style={{
                  ...visualizingButton,
                  ...(resetDisabled ?
                  styles.disabled : {}),
                }}
                >
                  <Undo />
                  <Hidden>Reset bins</Hidden>
                </Button>

              <Button
                leftIcon={<Group color={groupDisabled ? '#fff' : 'currentColor'} style={{ width: '10px' }} />}
                disabled={groupDisabled}
                onClick={() => {
                  binGrouping();
                  setSelectedGroupBins({});
                  setGlobalWarning('');
                  setListWarning({});
                }}
                style={{
                  ...visualizingButton,
                  ...(groupDisabled ?
                  styles.disabled : {}),
                }}
                >
                Group
              </Button>

              <Button
                leftIcon={<Ungroup color={ungroupDisabled ? '#fff' : 'currentColor'} style={{ width: '10px' }} />}
                disabled={ungroupDisabled}
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
                style={{
                  ...visualizingButton,
                  ...(ungroupDisabled ? styles.disabled : {}),
                }}
                >
                Ungroup
              </Button>

              <Button
                leftIcon={<Hide style={hideDisabled ? styles.disabled : {}}/>}
                disabled={hideDisabled}
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
                style={{
                  ...visualizingButton,
                  ...(hideDisabled ? styles.disabled : {}),
                }}
                >
                Hide
              </Button>
            </Row>
          </Row>
          <Column style={styles.list}>
            {map(
              groupNameMapping,
              (group: string[], groupName: string) => {
                const isCustomBin = group.length > 1 || group[0] !== groupName;
                const isEditing = editingGroupName === groupName;

                return (
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
                      backgroundColor: group.every((binKey: string) => selectedGroupBins[binKey]) ? theme.tableHighlight : '',
                    }}
                    >
                    {isCustomBin
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
                          isEditing={isEditing}
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
                          {`${currentBins[group[0]].key === '_missing' 
                          ? 'Missing' 
                          : currentBins[group[0]].key} (${currentBins[group[0]].doc_count})`}
                        </div>
                      )}
                  </Row>

                  {isCustomBin && (
                    group.map((bin: string) => (
                      <Row
                        key={bin}
                        onClick={() => {
                          setSelectedGroupBins({
                            ...selectedGroupBins,
                            [bin]: !selectedGroupBins[bin],
                          });
                        }}
                        style={{
                          backgroundColor: selectedGroupBins[bin] ? theme.tableHighlight : '',
                          display: 'list-item',
                          listStylePosition: 'inside',
                          listStyleType: 'disc',
                          paddingLeft: '5px',
                        }}
                        >
                        {`${bin === '_missing' ? 'Missing' : bin} (${currentBins[bin].doc_count})`}
                      </Row>
                    )))}
                </Column>
              )
                      }
            )}
          </Column>
        </Column>

        <Column
          style={{
            height: '16rem',
            width: '100%',
          }}
          >
          <Row style={styles.boxHeader} >
            <span style={{ fontWeight: 'bold' }} >Hidden Values</span>

            <Button
              leftIcon={<Show style={showDisabled ? styles.disabled : {}} />}
              disabled={showDisabled}
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
              style={{
                ...visualizingButton,
                ...(showDisabled ? styles.disabled : {}),
              }}
              >
              Show
            </Button>
          </Row>
          <Column style={styles.list}>
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
                    backgroundColor: selectedHidingBins[binKey] ? theme.tableHighlight : '',
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
          borderTop: `1px solid ${theme.greyScale5}`,
          justifyContent: 'flex-end',
          marginTop: '1.5rem',
          padding: '15px',
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

        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button onClick={() => onUpdate(currentBins)}>
          Save Bins
        </Button>
      </Row>
    </Column >
  );
}

export default compose(
  setDisplayName('EnhancedCategoricalCustomBinsModal'),
  withState('editingGroupName', 'setEditingGroupName', ''),
  withState('currentBins', 'setCurrentBins', ({ bins }: { bins: IBinsProps }) => bins),
  withState('selectedHidingBins', 'setSelectedHidingBins', {}),
  withState('selectedGroupBins', 'setSelectedGroupBins', {}),
  withState('globalWarning', 'setGlobalWarning', ''),
  withState('listWarning', 'setListWarning', {}),
  withProps(({ currentBins }) => ({
    groupNameMapping: groupBy(
      Object.keys(currentBins)
        .filter((bin: string) => currentBins[bin].groupName !== ''),
      key => currentBins[key].groupName
    ),
  })),
  withProps(({
    currentBins,
    groupNameMapping,
    selectedGroupBins,
    setCurrentBins,
    setEditingGroupName,
    setSelectedHidingBins,
  }) => ({
    binGrouping: () => {
      const selectedCustomBins = Object.keys(selectedGroupBins)
        .filter(field => selectedGroupBins[field])
        .filter(field => typeof groupNameMapping[field] === 'undefined')
        .reduce((acc: string[], curr: string, idx: number, src: string[]) => {
          const matchingCustomBins = Object.values(groupNameMapping)
            .map((groups: any, groupIndex: number) => 
              groups.indexOf(curr) >= 0 &&
                groups.every((group: string) => src.indexOf(group) >= 0) 
                  ? Object.keys(groupNameMapping)[groupIndex]
                  : ''
            )
            .filter((group: string) => group.length > 0);
          return matchingCustomBins.length > 0 
            && acc.indexOf(matchingCustomBins[0]) === -1
              ? acc.concat(matchingCustomBins)
              : acc;
        }, []);
      
      const isEditingGroupName = selectedCustomBins.length !== 1;
      const selectedCustomBinName = isEditingGroupName 
        ? ''
        : selectedCustomBins[0];

      const newGroupName = initialName(
        Object.values(currentBins).map((bin: IBinProps) => bin.groupName), 'selected Value '
      );
      setEditingGroupName(isEditingGroupName ? newGroupName : '');
      setCurrentBins({
        ...currentBins,
        ...reduce(selectedGroupBins, (acc, val, key) => {
          if (val) {
            return {
              ...acc,
              [key]: {
                ...currentBins[key],
                groupName: isEditingGroupName
                  ? newGroupName
                  : selectedCustomBinName,
              },
            };
          }
          return acc;
        }, {}),
      });
      setSelectedHidingBins({});
    },
  }))
)(CategoricalCustomBinsModal);
