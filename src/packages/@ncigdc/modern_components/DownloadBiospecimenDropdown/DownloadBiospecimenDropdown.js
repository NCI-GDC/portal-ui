/* @flow */

import React from 'react';
import { compose, withState } from 'recompose';
import DownloadButton from '@ncigdc/components/DownloadButton';
import DownloadIcon from '@ncigdc/theme/icons/Download';
import Spinner from '@ncigdc/theme/icons/Spinner';
import Dropdown from '@ncigdc/uikit/Dropdown';
import Button from '@ncigdc/uikit/Button';
import { withTheme, theme } from '@ncigdc/theme';
import { connect } from 'react-redux';
import { CreateExploreCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import withRouter from '@ncigdc/utils/withRouter';

const styles = {
  dropdownContainer: {
    top: '100%',
    whiteSpace: 'nowrap',
    marginTop: '3px',
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
  connect(),
  withRouter,
  withState('state', 'setState', {
    tsvDownloading: false,
    jsonDownloading: false,
    setCreating: false,
    setId: '',
    size: 0,
  }),
  withTheme,
)(
  ({
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
    shouldCreateSet,
  }) => {
    const biospecimenCount = viewer ? viewer[scope].cases.hits.total : null;
    const buttonProps = {
      className: 'data-download-biospecimen',
      style: { ...styles.dropdownButton, ...buttonStyles },
      leftIcon:
        state.setCreating || state.jsonDownloading || state.tsvDownloading ? (
          <Spinner />
        ) : (
          <DownloadIcon />
        ),
    };
    return (
      <Dropdown
        className="data-download-biospecimen"
        disabled={state.setCreating}
        button={
          shouldCreateSet ? (
            <CreateExploreCaseSetButton
              {...buttonProps}
              filters={filters}
              isCreating={false}
              onClick={() => setState({ ...state, setCreating: true })}
              onComplete={(setId, size) => {
                setState({ ...state, setId, size, setCreating: false });
              }}
              displaySpinnerOverlay={false}
            >
              {state.setCreating ||
              state.jsonDownloading ||
              state.tsvDownloading
                ? 'Processing'
                : inactiveText}
            </CreateExploreCaseSetButton>
          ) : (
            <Button {...buttonProps}>
              {state.jsonDownloading || state.tsvDownloading
                ? 'Processing'
                : inactiveText}
            </Button>
          )
        }
        dropdownStyle={{ ...styles.dropdownContainer, ...dropdownStyles }}
      >
        {state.setCreating ? (
          <div />
        ) : (
          <div>
            <DownloadButton
              className="data-download-biospecimen-tsv"
              style={styles.button(theme)}
              endpoint="/biospecimen_tar"
              format="tsv"
              activeText="Processing"
              inactiveText="TSV"
              altMessage={false}
              setParentState={currentState =>
                setState(s => ({
                  ...s,
                  tsvDownloading: currentState,
                }))}
              active={state.tsvDownloading}
              size={biospecimenCount ? biospecimenCount : state.size}
              filters={
                shouldCreateSet
                  ? {
                      op: 'and',
                      content: [
                        {
                          op: 'in',
                          content: {
                            field: 'cases.case_id',
                            value: [`set_id:${state.setId}`],
                          },
                        },
                      ],
                    }
                  : filters
              }
              filename={tsvFilename}
            />
            <DownloadButton
              className="data-download-biospecimen"
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
              filters={
                shouldCreateSet
                  ? {
                      op: 'and',
                      content: [
                        {
                          op: 'in',
                          content: {
                            field: 'cases.case_id',
                            value: [`set_id:${state.setId}`],
                          },
                        },
                      ],
                    }
                  : filters
              }
              size={biospecimenCount ? biospecimenCount : state.size}
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
          </div>
        )}
      </Dropdown>
    );
  },
);
