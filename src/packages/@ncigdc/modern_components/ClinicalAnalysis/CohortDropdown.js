import React from 'react';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import {
  first, keys, map, values,
} from 'lodash';

import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import Tooltip from '@ncigdc/uikit/Tooltip/Tooltip';

import { updateClinicalAnalysisSet } from '@ncigdc/dux/analysis';

const CohortDropdown = ({
  currentAnalysis,
  disabled,
  disabledMessage,
  dispatch,
  sets,
}) => {
  const dropdownItems = map(sets.case, (name, setKey) => {
    if (setKey === keys(currentAnalysis.sets.case)[0]) {
      return null;
    }
    return (
      <Tooltip
        Component={name.length > 20 ? name : null}
        >
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
          }}
          >
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            >
            {name}
          </span>
        </DropdownItem>
      </Tooltip>
    );
  });

  const setName = first(values(currentAnalysis.sets.case));
  return (
    <Dropdown
      button={(
        <Tooltip
          Component={
            disabled ? disabledMessage : setName.length > 20 ? setName : null
          }
          >
          <Button
            className="cohort-dropdown"
            disabled={disabled}
            style={{
              ...visualizingButton,
              justifyContent: 'flex-start',
              padding: '0 6px 0 4px',
              width: 170,
            }}
            >
            <span
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                textAlign: 'left',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: 150,
              }}
              >
              {setName}
            </span>
            <DownCaretIcon
              style={{
                position: 'absolute',
                right: 2,
              }}
              />
          </Button>
        </Tooltip>
      )}
      dropdownStyle={{
        cursor: 'pointer',
        left: 0,
        maxHeight: '400px',
        overflow: 'auto',
      }}
      isDisabled={disabled}
      style={{
        justifyContent: 'flex-start',
      }}
      >
      {dropdownItems}
    </Dropdown>
  );
};

export default CohortDropdown;
