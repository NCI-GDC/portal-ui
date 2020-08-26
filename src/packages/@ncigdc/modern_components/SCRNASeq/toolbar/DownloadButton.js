import React, { Component } from 'react';

import DropDown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';

import ToolbarButton from './ToolbarButton';

const downloadOptions = {
  downloadAnalysis: [
    {
      format: 'cellCounts',
      label: 'Cell Counts',
    },
    {
      format: 'differentialGeneExpression',
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
            key={dlOpt.label}
            onClick={this.handleClick}
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
