import React, { Component } from 'react';

import DropDown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';

import ToolbarButton from './ToolbarButton';

const downloadOptions = {
  downloadAnalysis: [
    {
      data_type: 'Single Cell Analysis',
      label: 'Cell Counts',
    },
    {
      data_type: 'Differential Gene Expression',
      label: 'Differential Gene Expression',
    },
  ],
  downloadImage: [
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
  ],
};

export default class DownloadButton extends Component {
  handleClick = e => {
    const {
      name,
      onAnalysisClick,
      onToolbarClick,
    } = this.props;
    if (name === 'downloadAnalysis') {
      onAnalysisClick(e);
    } else {
      onToolbarClick(e);
    }
  }

  render() {
    const {
      faClass,
      label,
      name,
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
        dropdownStyle={name === 'downloadAnalysis' && {
          width: 200,
        }}
        >
        {downloadOptions[name].map(dlOpt => (
          <DropdownItem
            data-format={dlOpt.format || ''}
            data-name={name}
            data-scale={dlOpt.scale || ''}
            data-type={dlOpt.data_type || ''}
            key={dlOpt.label}
            onClick={this.handleClick(dlOpt)}
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
  }
}
