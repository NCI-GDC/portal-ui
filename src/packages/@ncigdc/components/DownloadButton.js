// @flow

import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, mapProps } from 'recompose';

import download from '@ncigdc/utils/download';
import Button from '@ncigdc/uikit/Button';
import DownloadIcon from '@ncigdc/theme/icons/Download';
import Spinner from '@ncigdc/theme/icons/Spinner';
import Hidden from '@ncigdc/components/Hidden';

const styles = {
  buttons: {
    flex: 'none',
    marginLeft: '0.2rem',
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
  altMessage = false,
  style = {},
  extraParams = {},
}) => {
  const icon = active ? <Spinner key="icon" /> : <DownloadIcon key="icon" />;
  const text = active ? activeText : inactiveText;

  return (
    <Button
      style={{
        ...style,
        ...styles.buttons,
      }}
      leftIcon={text && icon}
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
          ...extraParams,
        };

        setActive(true);

        download({
          params,
          url,
          method: 'POST',
          altMessage,
        })(
          () => {},
          () => setActive(false)
        );
      }}
    >
      {text || [icon, <Hidden key="hidden">download</Hidden>]}
    </Button>
  );
};

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
  altMessage: React.PropTypes.bool,
  style: React.PropTypes.object,
  extraParams: React.PropTypes.object,
  setParentState: React.PropTypes.func,
};

const enhance = compose(
  connect(),
  withState('state', 'setState', {
    active: false,
  }),
  mapProps(({ setParentState, state, setState, active, ...rest }) => ({
    setActive: setParentState ? setParentState : (active) => setState(s => ({...s, active})),
    active: active ? active : state.active,
    ...rest,
  }))
);

export default enhance(DownloadButton);
