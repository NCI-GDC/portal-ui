import React, { Component } from 'react';

import DropDown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';

import ToolbarButton from './ToolbarButton';
import download from '@ncigdc/utils/filesaver';

const downloadOptionsDefaults = [
  // https://github.com/plotly/plotly.js/blob/master/src/components/modebar/buttons.js
  {
    format: 'svg',
    label: 'SVG',
    name: 'downloadImage',
    scale: 1,
  },
  {
    format: 'png',
    label: 'PNG',
    name: 'downloadImage',
    scale: 3,
  },
];

export default class DownloadButton extends Component {
  handleClick = e => {
    const { onToolbarClick = () => {}} = this.props;
    onToolbarClick(e);
  }

  render() {
    const {
      faClass,
      label,
      name,
      downloadOptions = downloadOptionsDefaults,
    } = this.props;
    return (
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
            data-format={dlOpt.format || ''}
            data-name={dlOpt.name || ''}
            data-scale={dlOpt.scale || ''}
            key={dlOpt.label}
            onClick={this.handleClick}
            style={{
              cursor: 'pointer',
              minWidth: '50px',
              width: 'auto',
            }}
            >
            {dlOpt.label}
          </DropdownItem>
        ))}
      </DropDown>
    );
  }
}
