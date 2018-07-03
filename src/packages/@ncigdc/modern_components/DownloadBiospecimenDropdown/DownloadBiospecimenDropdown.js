/* @flow */

import React from 'react';
import { compose, withState } from 'recompose';
import DownloadButton from '@ncigdc/components/DownloadButton';
import Dropdown from '@ncigdc/uikit/Dropdown';
// import DownloadIcon from '@ncigdc/theme/icons/Download';
import download from '@ncigdc/utils/download';

// import Spinner from '@ncigdc/theme/icons/Spinner';
// import Button from '@ncigdc/uikit/Button';
import { withTheme, theme } from '@ncigdc/theme';
import { connect } from 'react-redux';
import { notify } from '@ncigdc/dux/notification';
import { Column } from '@ncigdc/uikit/Flex/index';
import { CreateExploreCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
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
    setId: '',
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
     onClick,
     dispatch,
     push,
   }) => {
    const biospecimenCount = viewer ? viewer[scope].cases.hits.total : null;
    return (
      <Dropdown
        className="data-download-biospecimen"
        button={
          <CreateExploreCaseSetButton
            className="data-download-biospecimen-button"
            filters={filters}
            isCreating={true}
            style={{ ...styles.dropdownButton, ...buttonStyles }}
            onComplete={setId => {
              setState({setId: setId});
              // download({
              //   pathname: '/explore',
              //   query: {
              //     searchTableTab: 'cases',
              //     filters: stringifyJSONParam({
              //       op: 'IN',
              //       content: [
              //         {
              //           field: 'cases.case_id',
              //           value: [`set_id:${setId}`],
              //         },
              //       ],
              //     }),
              //   },
              // });
            }}
          >
            {state.jsonDownloading || state.tsvDownloading
              ? 'Processing'
              : inactiveText}
          </CreateExploreCaseSetButton>
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
          filters={{
            op:"IN",
            content:[
              {
                field:"cases.case_id",
                value:[`set_id:${state.setId}`],
              },
            ]}}
          filename={tsvFilename}
          scope={scope}
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
          filters={{
            op:"IN",
            content:[
              {
                field:"cases.case_id",
                value:[`set_id:${state.setId}`],
              },
            ]}}
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
