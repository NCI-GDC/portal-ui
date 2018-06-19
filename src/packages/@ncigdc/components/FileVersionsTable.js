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
//import { fetchApi } from '@ncigdc/utils/ajax';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import saveFile from '@ncigdc/utils/filesaver';
import DropDown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';

export default compose(
  withTheme,
  withState('data', 'setData', []),
  lifecycle({
    async componentDidMount(): Promise<*> {
      const data = await fetch('http://localhost:5001/history', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': true,
          'X-Auth-Token': 'secret admin token',
        },
      }).then(r => r.json());
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
)(({ data }) => (
  <EntityPageHorizontalTable
    rightComponent={
      <DropDown
        className={'test-download-file-versions'}
        button={
          <Button leftIcon={<DownloadIcon />} style={visualizingButton}>
            Download
          </Button>
        }
      >
        <DropdownItem
          key="file-version-tsv"
          className="test-file-version-tsv"
          style={{
            cursor: 'pointer',
            padding: '0.6rem 1rem',
            fontSize: '14px',
          }}
          onClick={() => {
            console.log('tsv');
          }}
        >
          TSV
        </DropdownItem>
        <DropdownItem
          key="file-version-json"
          className="test-file-version-json"
          style={{
            cursor: 'pointer',
            padding: '0.6rem 1rem',
            fontSize: '14px',
          }}
          onClick={() => {
            console.log('json');
          }}
        >
          JSON
        </DropdownItem>
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
