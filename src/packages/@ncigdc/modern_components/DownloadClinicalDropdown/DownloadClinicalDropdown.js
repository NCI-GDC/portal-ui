/* @flow */

import React from 'react';
import { compose, withState } from 'recompose';
import DownloadButton from '@ncigdc/components/DownloadButton';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DownloadIcon from '@ncigdc/theme/icons/Download';
import Spinner from '@ncigdc/theme/icons/Spinner';
import Button from '@ncigdc/uikit/Button';
import { withTheme, theme } from '@ncigdc/theme';

export const styles = {
  dropdownContainer: {
    top: '100%',
    whiteSpace: 'nowrap',
    marginTop: '8px',
    minWidth: '100%',
    width: '100%',
    left: '1px',
    borderRadius: '5px',
  },
  dropdownButton: {
    marginLeft: '0.2rem',
  },
  common: theme => ({
    backgroundColor: 'transparent',
    color: theme.greyScale2,
    justifyContent: 'flex-start',
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  }),
  button: theme => ({
    borderRadius: '0px',
    marginLeft: '0px',
    ...styles.common(theme),
    '[disabled]': styles.common(theme),
  }),
};

export default compose(
  withState('activeTab', 'setTab', 0),
  withState('state', 'setState', {
    tsvDownloading: false,
    jsonDownloading: false,
  }),
  withTheme,
)(
  ({
    activeTab,
    setTab,
    active,
    state,
    setState,
    projectId,
    viewer,
    button,
    filters,
    tsvFilename,
    jsonFilename,
    inactiveText,
    dropdownStyles = {},
    buttonStyles = {},
    scope = 'repository',
  }) => {
    const clinicalCount = viewer ? viewer[scope].cases.hits.total : null;
    return (
      <Dropdown
        button={(
          <Button
            className="data-download-clinical-button"
            leftIcon={
              state.jsonDownloading || state.tsvDownloading ? (
                <Spinner />
              ) : (
                <DownloadIcon />
              )
            }
            style={{
              ...styles.common,
              ...styles.dropdownButton,
              ...buttonStyles,
            }}>
            {state.jsonDownloading || state.tsvDownloading
              ? 'Processing'
              : inactiveText}
          </Button>
        )}
        className="data-download-clinical"
        dropdownStyle={{
          ...styles.dropdownContainer,
          ...dropdownStyles,
        }}>
        <DownloadButton
          active={state.tsvDownloading}
          activeText="Processing"
          altMessage={false}
          className="data-download-clinical-tsv"
          endpoint="/clinical_tar"
          filename={tsvFilename}
          filters={filters}
          format="TSV"
          inactiveText="TSV"
          scope={scope}
          setParentState={currentState => setState(s => ({
            ...s,
            tsvDownloading: currentState,
          }))}
          size={clinicalCount}
          style={styles.button(theme)} />
        <DownloadButton
          active={state.jsonDownloading}
          activeText="Processing"
          altMessage={false}
          className="data-download-clinical-json"
          dataExportExpands={[
            'demographic',
            'diagnoses',
            'diagnoses.treatments',
            'family_histories',
            'exposures',
          ]}
          endpoint="/cases"
          fields={['case_id']}
          filename={jsonFilename}
          filters={filters}
          inactiveText="JSON"
          setParentState={currentState => setState(s => ({
            ...s,
            jsonDownloading: currentState,
          }))}
          size={clinicalCount}
          style={styles.button(theme)} />
      </Dropdown>
    );
  },
);
