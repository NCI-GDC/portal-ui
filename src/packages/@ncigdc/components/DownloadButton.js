// @flow

import React from "react";
import { connect } from "react-redux";
import { compose, withState, mapProps } from "recompose";

import download from "@ncigdc/utils/download";
import Button from "@ncigdc/uikit/Button";
import DownloadIcon from "@ncigdc/theme/icons/Download";
import Spinner from "@ncigdc/theme/icons/Spinner";
import Hidden from "@ncigdc/components/Hidden";

const styles = {
  buttons: {
    flex: "none",
    marginLeft: "0.2rem"
  }
};

type TDownloadButton = {
  url: string,
  active: boolean,
  disabled: boolean,
  filename: string,
  dataExportExpands: Array<string>,
  setActive: () => {},
  activeText: string,
  inactiveText: string,
  returnType: string,
  size: number,
  format: string,
  fields: Array<string>,
  filters: Object,
  altMessage: boolean,
  style: Object,
  extraParams: Object,
  setParentState: () => {}
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
  format = "JSON",
  fields = [],
  filters = {},
  active,
  setActive,
  altMessage = false,
  style = {},
  extraParams = {}
}: TDownloadButton) => {
  const icon = active ? <Spinner key="icon" /> : <DownloadIcon key="icon" />;
  const text = active ? activeText : inactiveText;

  return (
    <Button
      style={{
        ...style,
        ...styles.buttons
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
          ...extraParams
        };

        setActive(true);

        download({
          params,
          url,
          method: "POST",
          altMessage
        })(() => {}, () => setActive(false));
      }}
    >
      {text || [icon, <Hidden key="hidden">download</Hidden>]}
    </Button>
  );
};

const enhance = compose(
  connect(),
  withState("state", "setState", {
    active: false
  }),
  mapProps(({ setParentState, state, setState, active, ...rest }) => ({
    setActive: setParentState
      ? setParentState
      : active => setState(s => ({ ...s, active })),
    active: active ? active : state.active,
    ...rest
  }))
);

export default enhance(DownloadButton);
