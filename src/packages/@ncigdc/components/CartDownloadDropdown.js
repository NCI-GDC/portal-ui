// @flow
/* eslint react/no-unescaped-entities: 0 */

import React from "react";
import { compose, withState } from "recompose";
import { connect } from "react-redux";
import urlJoin from "url-join";

import DownloadButton from "@ncigdc/components/DownloadButton";
import NoAccessModal from "@ncigdc/components/Modals/NoAccessModal";
import BaseModal from "@ncigdc/components/Modals/BaseModal";

import DownCaretIcon from "react-icons/lib/fa/caret-down";

import { setModal } from "@ncigdc/dux/modal";

import Dropdown from "@ncigdc/uikit/Dropdown";
import Button from "@ncigdc/uikit/Button";
import { Column, Row } from "@ncigdc/uikit/Flex";
import { ExternalLink } from "@ncigdc/uikit/Links";

import { withTheme } from "@ncigdc/theme";
import DownloadIcon from "@ncigdc/theme/icons/Download";
import Spinner from "@ncigdc/theme/icons/Spinner";

import download from "@ncigdc/utils/download";
/*----------------------------------------------------------------------------*/

const styles = {
  common: theme => ({
    backgroundColor: "transparent",
    color: theme.greyScale2,
    justifyContent: "flex-start",
    ":hover": {
      backgroundColor: theme.greyScale6
    }
  }),
  button: theme => ({
    borderRadius: "0px",
    marginLeft: "0px",
    ...styles.common(theme),
    "[disabled]": styles.common(theme)
  }),
  iconSpacing: {
    marginRight: "0.6rem"
  }
};

const downloadCart = (files, dispatch, setState) => {
  const controlledFiles = files.filter(file => file.access === "controlled");

  if (controlledFiles.length) {
    dispatch(
      setModal(
        <NoAccessModal
          message={
            <div>
              <p>
                You are attempting to download files that you are not authorized to access.
              </p>
              <p>
                <span className="label label-success">
                  {files.length - controlledFiles.length}
                </span> files that you are authorized to download.
              </p>
              <p>
                <span className="label label-danger">
                  {controlledFiles.length}
                </span> files that you are not authorized to download.
              </p>
            </div>
          }
          primaryButton={
            <Button
              onClick={() =>
                downloadCart(
                  files.filter(file => file.access === "open"),
                  dispatch,
                  setState
                )}
              style={{ margin: "0 10px" }}
            >
              <span>
                Download
                {" "}
                {files.length - controlledFiles.length}
                {" "}
                authorized files
              </span>
            </Button>
          }
          closeText="Cancel"
        />
      )
    );
  } else if (files.reduce((sum, x) => sum + x.file_size, 0) > 5 * 10e8) {
    dispatch(
      setModal(
        <BaseModal title="Cart size limit">
          <p>Your cart contains more than 5GBs of data.</p>
          <p>
            Please select the "Download &gt; Manifest" option and use the&nbsp;
            <ExternalLink
              hasExternalIcon={false}
              title="GDC Data Transfer Tool"
              href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
            >
              Data Transfer Tool
            </ExternalLink> Tool to continue.
          </p>
        </BaseModal>
      )
    );
  } else {
    dispatch(setModal(null));
    setState(s => ({ ...s, cartDownloading: true }));
    download({
      url: urlJoin(process.env.REACT_APP_GDC_AUTH, "api/data"),
      params: {
        ids: files.map(file => file.file_id)
      },
      method: "POST",
      altMessage: true
    })(() => {}, () => setState(s => ({ ...s, cartDownloading: false })));
  }
};

const CartDownloadDropdown = ({
  files,
  theme,
  disabled = false,
  state,
  setState,
  dispatch
}) => (
  <Row>
    <Dropdown
      dropdownStyle={{
        marginTop: "2px",
        borderRadius: "4px"
      }}
      dropdownItemClass={false}
      button={
        <Button
          style={{ marginLeft: "10px" }}
          leftIcon={
            state.manifestDownloading || state.cartDownloading
              ? <Spinner />
              : <DownloadIcon />
          }
          rightIcon={<DownCaretIcon />}
        >
          Download
        </Button>
      }
    >
      <Column>
        <DownloadButton
          style={styles.button(theme)}
          url={urlJoin(process.env.REACT_APP_GDC_AUTH, "api/manifest")}
          activeText="Manifest"
          inactiveText="Manifest"
          altMessage={false}
          setParentState={currentState =>
            setState(s => ({ ...s, manifestDownloading: currentState }))}
          active={state.manifestDownloading}
          extraParams={{
            ids: files.files.map(file => file.file_id)
          }}
        />
        <Button
          style={styles.button(theme)}
          disabled={state.cartDownloading}
          onClick={() => downloadCart(files.files, dispatch, setState)}
          leftIcon={state.cartDownloading ? <Spinner /> : <DownloadIcon />}
        >
          Cart
        </Button>
      </Column>
    </Dropdown>
  </Row>
);

export default compose(
  connect(),
  withTheme,
  withState("state", "setState", {
    manifestDownloading: false,
    cartDownloading: false
  })
)(CartDownloadDropdown);
