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
  handleAnalysisClick = data_type => () => {
    console.log({ data_type })
    const { onAnalysisClick } = this.props;
    onAnalysisClick(data_type);
  }

  handleToolbarClick = e => {
    const { onToolbarClick } = this.props;
    onToolbarClick(e);
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
        {name === 'downloadAnalysis'
          ? (
            downloadOptions[name].map(dlOpt => (
              <DropdownItem
                key={dlOpt.label}
                onClick={this.handleAnalysisClick(dlOpt.data_type)}
                style={{
                  cursor: 'pointer',
                  width: 'auto',
                }}
                >
                {dlOpt.label}
              </DropdownItem>
            ))
          )
          : (
            downloadOptions[name].map(dlOpt => (
              <DropdownItem
                data-format={dlOpt.format}
                data-name={name}
                data-scale={dlOpt.scale}
                key={dlOpt.label}
                onClick={this.handleToolbarClick}
                style={{
                  cursor: 'pointer',
                  width: 'auto',
                }}
                >
                {dlOpt.label}
              </DropdownItem>
            ))
          )
        }
      </DropDown>
    );
  }
}
