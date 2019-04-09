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
export default ({ sets, currentAnalysis, dispatch }) => {
  const dropdownItems = _.map(sets.case, (name, setKey) => {
    if (setKey !== _.keys(currentAnalysis.sets.case)[0]) {
      return (
        <DropdownItem
          key={setKey}
          className="all-sets-item"
          onClick={() => {
            dispatch(
              updateClinicalAnalysisSet({
                id: currentAnalysis.id,
                setId: setKey,
                setName: name,
              })
            );
          }}
          aria-label={`Switch selected set to ${name}`}
        >
          {name}
        </DropdownItem>
      );
    }
  });

  const setName = _.first(_.values(currentAnalysis.sets.case));
  return (
    <Dropdown
      style={{
        justifyContent: 'flex-start',
      }}
      button={
        <Tooltip Component={setName.length > 16 ? setName : null}>
          <Button
            className="cohort-dropdown"
            style={{
              ...visualizingButton,
              padding: '0 6px',
              width: 145,
              justifyContent: 'flex-start',
            }}
            rightIcon={<DownCaretIcon />}
            buttonContentStyle={{
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            {_.truncate(setName, {
              length: 16,
            })}
          </Button>
        </Tooltip>
      }
      dropdownStyle={{ left: 0, cursor: 'pointer' }}
    >
      {dropdownItems}
    </Dropdown>
  );
};
