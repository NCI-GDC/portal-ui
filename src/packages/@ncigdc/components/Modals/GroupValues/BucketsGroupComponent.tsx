import React from 'react';
import {
  some,
} from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';

import ControlEditableRow from '@ncigdc/uikit/ControlEditableRow';
import { IBinProps, ISelectedBinsProps } from './types';

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

export default BucketsGroupComponent;
