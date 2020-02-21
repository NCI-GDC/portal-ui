import React from 'react';
// import ModeBarButtons from 'plotly.js/src/components/modebar/buttons';

import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Hidden from '@ncigdc/components/Hidden';

const ToolbarButton = ({
  btnType, dataAttr, dataVal, faClass, graphDiv, label, ModeBarButtons,
}) => (
  <Tooltip
    Component={
      <div>{label}</div>
    }
    >
    <Button
      data-attr={dataAttr}
      data-val={dataVal}
      onClick={(e) => {
        e.persist();
        ModeBarButtons[btnType].click(graphDiv, e);
      }}
      style={{
        ...visualizingButton,
        marginLeft: 6,
      }}
      >
      <i aria-hidden="true" className={`fa ${faClass}`} />
      <Hidden>{label}</Hidden>
    </Button>
  </Tooltip>
);

export default ToolbarButton;
