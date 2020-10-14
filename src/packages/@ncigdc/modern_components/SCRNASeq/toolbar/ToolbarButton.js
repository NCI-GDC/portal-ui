import FullScreenIcon from 'react-icons/lib/md/fullscreen';

import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Hidden from '@ncigdc/components/Hidden';

const ToolbarButton = ({
  attr = '',
  faClass = '',
  label,
  name,
  onToolbarClick,
  val = '',
}) => (
  <Tooltip
    Component={
      <div>{label}</div>
    }
    >
    <Button
      data-attr={attr}
      data-name={name}
      data-val={val}
      onClick={onToolbarClick}
      style={{
        ...visualizingButton,
        marginLeft: 6,
      }}
      >
      {faClass && (
        <i
          aria-hidden="true"
          className={`fa ${faClass}`}
          />
      )}
      {name === 'fullscreen' && <FullScreenIcon />}
      <Hidden>{label}</Hidden>
    </Button>
  </Tooltip>
);

export default ToolbarButton;
