import React, { Component } from 'react';

import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Hidden from '@ncigdc/components/Hidden';

export default class ToolbarButton extends Component {
  handleClick = e => {
    const { onToolbarClick = () => {} } = this.props;
    onToolbarClick(e);
  }

  render() {
    const {
      attr = '',
      faClass,
      label,
      name,
      val = '',
    } = this.props;
    return (
      <Tooltip
        Component={
          <div>{label}</div>
      }
        >
        <Button
          data-attr={attr}
          data-name={name}
          data-val={val}
          onClick={this.handleClick}
          style={{
            ...visualizingButton,
            marginLeft: 6,
          }}
          >
          <i
            aria-hidden="true"
            className={`fa ${faClass}`}
            />
          <Hidden>{label}</Hidden>
        </Button>
      </Tooltip>
    );
  }
}
