import React from 'react';
import {
  compose,
  lifecycle,
  withState,
  branch,
  renderComponent,
} from 'recompose';
import moment from 'moment';

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
          'Access-Control-Allow-Origin': true,
        },
      });
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
          release_date: moment(d.release_date).format('YYYY-MM-DD'),
        })),
      );
    },
  }),
  branch(({ data }) => !data.length, renderComponent(() => <span />)),
)(({ data, theme }) => (
  <EntityPageHorizontalTable
    rightComponent={
      <DropDown
        className={'test-download-file-versions'}
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
        <DownloadButton
          className="data-download-clinical-tsv"
          style={styles.button(theme)}
          endpoint="/history"
          format={'TSV'}
          activeText="Processing"
          inactiveText="TSV"
          altMessage={false}
        />
        <DownloadButton
          className="data-download-clinical-tsv"
          endpoint="/history"
          style={styles.button(theme)}
          format={'JSON'}
          activeText="Processing"
          inactiveText="JSON"
          altMessage={false}
        />
      </DropDown>
    }
    data={data}
    style={{ width: '100%' }}
    title="Previous File Versions"
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
