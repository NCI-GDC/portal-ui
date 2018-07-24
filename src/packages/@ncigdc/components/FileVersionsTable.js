import React from 'react';
import {
  compose,
  lifecycle,
  withState,
  branch,
  renderComponent,
} from 'recompose';
import moment from 'moment';

import DownloadTableToTsvButton from '@ncigdc/components/DownloadTableToTsvButton';
import BubbleIcon from '@ncigdc/theme/icons/BubbleIcon';
import DownloadIcon from '@ncigdc/theme/icons/Download';
import { withTheme } from '@ncigdc/theme';
import { fetchApi } from '@ncigdc/utils/ajax';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import DownloadButton from '@ncigdc/components/DownloadButton';
import DropDown from '@ncigdc/uikit/Dropdown';
import { styles } from '@ncigdc/modern_components/DownloadClinicalDropdown/DownloadClinicalDropdown';

export default compose(
  withTheme,
  withState('data', 'setData', []),
  lifecycle({
    async componentDidMount(): Promise<*> {
      const data = await fetchApi(`/history/${this.props.fileId}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      try {
        this.props.setData(
          data.map(d => ({
            ...d,
            uuid:
              d.uuid === this.props.fileId ? (
                <div>
                  {d.uuid}{' '}
                  <BubbleIcon
                    text="Current Version"
                    backgroundColor={this.props.theme['secondary']}
                    style={{ marginLeft: '1em' }}
                  />
                </div>
              ) : (
                <div>{d.uuid}</div>
              ),
            release_date: d.release_date
              ? moment(d.release_date).format('YYYY-MM-DD')
              : '--',
          })),
        );
      } catch (e) {
        //means no history for the file, just display nothing
      }
    },
  }),
  branch(({ data }) => !data.length, renderComponent(() => <span />)),
)(({ data, fileId, theme }) => (
  <EntityPageHorizontalTable
    tableId="file-history-table"
    rightComponent={
      <DropDown
        className="test-download-file-versions"
        button={
          <Button
            leftIcon={<DownloadIcon />}
            style={{
              ...styles.common,
              ...styles.dropdownButton,
              ...visualizingButton,
            }}
          >
            Download
          </Button>
        }
        dropdownStyle={{ ...styles.dropdownContainer }}
      >
        <DownloadTableToTsvButton
          className="test-download-file-versions-tsv"
          leftIcon={<DownloadIcon />}
          selector="#file-history-table"
          filename={`file-history-${fileId}.tsv`}
          style={{ ...styles.button(theme), borderColor: 'transparent' }}
          displayTooltip={false}
        />
        <DownloadButton
          className="test-download-file-versions-json"
          endpoint={`/history/${fileId}`}
          style={styles.button(theme)}
          format={'JSON'}
          activeText="Processing"
          inactiveText="JSON"
          method="GET"
          altMessage={false}
        />
      </DropDown>
    }
    data={data}
    style={{ width: '100%', overflow: 'visible' }}
    title="File Versions"
    emptyMessage="No Previous File Versions"
    emptyMessageStyle={{ background: '#fff' }}
    headings={[
      { key: 'version', title: 'Version' },
      { key: 'uuid', title: 'File UUID' },
      { key: 'release_date', title: 'Release Date' },
      { key: 'data_release', title: 'Release Number' },
    ]}
  />
));
