/* @flow */

import React from 'react';
import { compose, withState } from 'recompose';
import DownloadButton from '@ncigdc/components/DownloadButton';
import { makeFilter } from '@ncigdc/utils/filters';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DownloadIcon from '@ncigdc/theme/icons/Download';
import Spinner from '@ncigdc/theme/icons/Spinner';
import Button from '@ncigdc/uikit/Button';
import moment from 'moment';
import { withTheme, theme } from '@ncigdc/theme';

const styles = {
  dropdownContainer: {
    top: '100%',
    whiteSpace: 'nowrap',
    marginTop: '5px',
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
  }) => {
    const biospecimenCount = viewer.repository.cases.hits.total;
    return (
      <Dropdown
        className="data-download-biospecimen"
        button={
          <Button
            className="data-download-biospecimen-button"
            style={{ ...styles.dropdownButton, ...buttonStyles }}
            leftIcon={
              state.jsonDownloading || state.tsvDownloading ? (
                <Spinner />
              ) : (
                <DownloadIcon />
              )
            }
          >
            {state.jsonDownloading || state.tsvDownloading
              ? 'Processing'
              : inactiveText}
          </Button>
        }
        dropdownStyle={{ ...styles.dropdownContainer, ...dropdownStyles }}
      >
        <DownloadButton
          className="data-download-biospecimen-tsv"
          size={biospecimenCount}
          style={styles.button(theme)}
          endpoint="/biospecimen_tar"
          format={'TSV'}
          activeText="Processing"
          inactiveText="TSV"
          altMessage={false}
          setParentState={currentState =>
            setState(s => ({
              ...s,
              tsvDownloading: currentState,
            }))}
          active={state.tsvDownloading}
          filters={filters}
          filename={tsvFilename}
        />
        <DownloadButton
          className="data-download-biospecimen"
          size={biospecimenCount}
          style={styles.button(theme)}
          endpoint="/cases"
          activeText="Processing"
          inactiveText="JSON"
          altMessage={false}
          setParentState={currentState =>
            setState(s => ({
              ...s,
              jsonDownloading: currentState,
            }))}
          active={state.jsonDownloading}
          filters={filters}
          fields={['case_id']}
          dataExportExpands={[
            'samples',
            'samples.portions',
            'samples.portions.analytes',
            'samples.portions.analytes.aliquots',
            'samples.portions.analytes.aliquots.annotations',
            'samples.portions.analytes.annotations',
            'samples.portions.submitter_id',
            'samples.portions.slides',
            'samples.portions.annotations',
            'samples.portions.center',
          ]}
          filename={jsonFilename}
        />
      </Dropdown>
    );
  },
);
