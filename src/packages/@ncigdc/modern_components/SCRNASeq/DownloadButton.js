import React, { Component } from 'react';

import DropDown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';

import ToolbarButton from './ToolbarButton';

const downloadOptions = [
  // https://github.com/plotly/plotly.js/blob/master/src/components/modebar/buttons.js
  {
    label: 'SVG',
    name: 'toImage',
  },
];

export default class DownloadButton extends Component {
  handleClick = e => {
    const { onToolbarClick } = this.props;
    onToolbarClick(e);
  }

  render() {
    const {
      faClass, label, name,
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
            data-name={dlOpt.name}
            key={dlOpt.name}
            onClick={this.handleClick}
            style={{ cursor: 'pointer' }}
            >
            {dlOpt.label}
          </DropdownItem>
        ))}
      </DropDown>
    );
  }
}
