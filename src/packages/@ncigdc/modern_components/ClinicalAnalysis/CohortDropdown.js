import React from 'react';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import _ from 'lodash';

import { Column, Row } from '@ncigdc/uikit/Flex';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import Tooltip from '@ncigdc/uikit/Tooltip/Tooltip';

import { updateClinicalAnalysisSet } from '@ncigdc/dux/analysis';

export default ({
  sets,
  currentAnalysis,
  dispatch,
  disabled,
  disabledMessage,
}) => {
  const dropdownItems = _.map(sets.case, (name, setKey) => {
    if (setKey !== _.keys(currentAnalysis.sets.case)[0]) {
      return (
        <DropdownItem
          aria-label={`Switch selected set to ${name}`}
          className="all-sets-item"
          key={setKey}
          onClick={() => {
            dispatch(
              updateClinicalAnalysisSet({
                id: currentAnalysis.id,
                setId: setKey,
                setName: name,
              })
            );
          }}>
          {name}
        </DropdownItem>
      );
    }
  });

  const setName = _.first(_.values(currentAnalysis.sets.case));
  return (
    <Dropdown
      button={(
        <Tooltip
          Component={
            disabled ? disabledMessage : setName.length > 13 ? setName : null
          }>
          <Button
            buttonContentStyle={{
              width: '100%',
              justifyContent: 'space-between',
            }}
            className="cohort-dropdown"
            disabled={disabled}
            rightIcon={<DownCaretIcon />}
            style={{
              ...visualizingButton,
              padding: '0 4px 0 6px',
              width: 145,
              justifyContent: 'flex-start',
            }}>
            {_.truncate(setName, {
              length: 13,
            })}
          </Button>
        </Tooltip>
      )}
      dropdownStyle={{
        left: 0,
        cursor: 'pointer',
      }}
      isDisabled={disabled}
      style={{
        justifyContent: 'flex-start',
      }}>
      {dropdownItems}
    </Dropdown>
  );
};
