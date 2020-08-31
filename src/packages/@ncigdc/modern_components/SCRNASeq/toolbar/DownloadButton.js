import React from 'react';

import DropDown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';

import ToolbarButton from './ToolbarButton';

const downloadOptions = [
  // https://github.com/plotly/plotly.js/blob/master/src/components/modebar/buttons.js
  {
    format: 'svg',
    label: 'SVG',
    scale: 1,
  },
  {
    format: 'png',
    label: 'PNG',
    scale: 3,
  },
];

const DownloadButton = ({
  faClass,
  label,
  name,
  onToolbarClick,
}) => (
  <DropDown
    button={(
      <ToolbarButton
        faClass={faClass}
        label={label}
        name={name}
        />
    )}
    >
    {downloadOptions.map(dlOpt => (
      <DropdownItem
        data-format={dlOpt.format}
        data-name={name}
        data-scale={dlOpt.scale}
        key={dlOpt.label}
        onClick={onToolbarClick}
        style={{
          cursor: 'pointer',
          width: 'auto',
        }}
        >
        {dlOpt.label}
      </DropdownItem>
    ))}
  </DropDown>
);

export default DownloadButton;