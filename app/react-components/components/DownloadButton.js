import _ from 'lodash';
import React from 'react';
import { compose, withState } from 'recompose';

import download from '../utils/download';
import Button from '../uikit/Button';

const styles = {
  buttons: {
    flex: 'none',
    color: '#fff',
    backgroundColor: '#0d95a1',
    marginLeft: '0.2rem',
    ':hover': {
      backgroundColor: '#27AFBB',
    }
  },
};

const DownloadButton = ({
  url,
  disabled = false,
  filename,
  dataExportExpands,
  activeText,
  inactiveText,
  returnType,
  size = 10000,
  format = 'JSON',
  fields = [],
  filters = {},
  active,
  setActive,
}) => (
  <Button
    style={styles.buttons}
    leftIcon={<i className={`fa fa-download ${active ? 'fa-spinner fa-pulse' : ''}`} />}
    disabled={disabled || active}
    onClick={() => {
      const params = {
        size,
        attachment: true,
        format,
        fields: fields.join(),
        filters,
        expand: dataExportExpands ? dataExportExpands.join() : undefined,
        pretty: true,
        ...(returnType ? { return_type: returnType } : {}),
        ...(filename ? { filename } : {}),
      };

      setActive(true);

      download({
        params,
        url,
        method: 'POST',
      })(
        () => {},
        () => setActive(false),
      );
    }}
  >
    {active ? activeText : inactiveText}
  </Button>
);

DownloadButton.propTypes = {
  url: React.PropTypes.string,
  active: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  filename: React.PropTypes.string,
  dataExportExpands: React.PropTypes.array,
  setActive: React.PropTypes.func,
  activeText: React.PropTypes.string,
  inactiveText: React.PropTypes.string,
  returnType: React.PropTypes.string,
  size: React.PropTypes.number,
  format: React.PropTypes.string,
  fields: React.PropTypes.array,
  filters: React.PropTypes.object,
};

const enhance = compose(
  withState('active', 'setActive', false)
);

export default enhance(DownloadButton);
