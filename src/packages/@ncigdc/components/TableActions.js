/* @flow */

import React from 'react';

import { Row } from '@ncigdc/uikit/Flex';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { parseFilterParam } from '@ncigdc/utils/uri';
import DownloadButton from '@ncigdc/components/DownloadButton';
import ArrangeColumnsButton from '@ncigdc/components/ArrangeColumnsButton';
import SortTableButton from '@ncigdc/components/SortTableButton';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DownloadIcon from '@ncigdc/theme/icons/Download';
import Spinner from '@ncigdc/theme/icons/Spinner';
import Button from '@ncigdc/uikit/Button';
import DownloadClinicalDropdown from '@ncigdc/modern_components/DownloadClinicalDropdown';
import DownloadBiospecimenDropdown from '@ncigdc/modern_components/DownloadBiospecimenDropdown/';

import { visualizingButton } from '@ncigdc/theme/mixins';
import DownloadTableToTsvButton from '@ncigdc/components/DownloadTableToTsvButton';
import type { TGroupFilter } from '@ncigdc/utils/filters/types';
import SetActions from '@ncigdc/components/SetActions';
import { compose, withState } from 'recompose';
import withRouter from '@ncigdc/utils/withRouter';
import pluralize from '@ncigdc/utils/pluralize';
import moment from 'moment';
import { withTheme } from '@ncigdc/theme';

import type { TRawQuery } from '@ncigdc/utils/uri/types';

type TProps = {
  type: string,
  displayType?: string,
  arrangeColumnKey?: string,
  total: number,
  sortOptions?: Array<Object>,
  endpoint: string,
  downloadFields: Array<string>,
  downloadable?: boolean,
  tsvSelector?: string,
  tsvFilename?: string,
  style?: Object,
  currentFilters?: TGroupFilter,
  downloadTooltip?: any,
  CreateSetButton?: ReactClass<{}>,
  RemoveFromSetButton?: ReactClass<{}>,
  idField?: string,
  query: TRawQuery,
  selectedIds?: Array<string>,
};

const enhance = compose(
  withRouter,
  withState('state', 'setState', {
    tsvDownloading: false,
    jsonDownloading: false,
  }),
  withTheme,
);

const TableActions = ({
  type,
  displayType = type,
  arrangeColumnKey,
  total,
  sortOptions,
  endpoint,
  downloadFields,
  downloadable = true,
  tsvSelector,
  tsvFilename,
  style,
  currentFilters,
  sort,
  score,
  downloadTooltip = 'Export All',
  CreateSetButton,
  AppendSetButton,
  RemoveFromSetButton,
  idField,
  query,
  selectedIds,
  scope,
  downloadClinical,
  downloadBiospecimen,
  // state,
  // setState,
  theme,
  totalCases,
}: TProps) => {
  return (
    <Row style={style} spacing="0.2rem" className="test-table-actions">
      {arrangeColumnKey && (
        <ArrangeColumnsButton
          entityType={arrangeColumnKey}
          style={visualizingButton}
        />
      )}
      {sortOptions && (
        <SortTableButton
          isDisabled={!sortOptions.length}
          options={sortOptions}
          query={query || {}}
          sortKey={`${type}s_sort`}
          style={visualizingButton}
        />
      )}
      {downloadBiospecimen && (
        <DownloadBiospecimenDropdown
          jsonFilename={`biospecimen.cases_selection.${moment().format(
            'YYYY-MM-DD',
          )}.json`}
          tsvFilename={`biospecimen.cases_selection.${moment().format(
            'YYYY-MM-DD',
          )}.tar.gz`}
          filters={
            currentFilters || parseFilterParam((query || {}).filters, {})
          }
          buttonStyles={visualizingButton}
          inactiveText={'Biospecimen'}
        />
      )}
      {downloadClinical && (
        <DownloadClinicalDropdown
          buttonStyles={visualizingButton}
          tsvFilename={`clinical.cases_selection.${moment().format(
            'YYYY-MM-DD',
          )}.tar.gz`}
          jsonFilename={`clinical.cases_selection.${moment().format(
            'YYYY-MM-DD',
          )}.json`}
          filters={
            currentFilters || parseFilterParam((query || {}).filters, {})
          }
          inactiveText={'Clinical'}
        />
      )}
      {downloadable && (
        <Tooltip Component={downloadTooltip}>
          <DownloadButton
            filters={
              currentFilters || parseFilterParam((query || {}).filters, {})
            }
            disabled={!total}
            filename={pluralize(displayType, total)}
            endpoint={endpoint}
            fields={downloadFields}
            style={visualizingButton}
            size={total}
            inactiveText="JSON"
            activeText="JSON"
            showIcon={false}
          />
        </Tooltip>
      )}
      {tsvSelector &&
        tsvFilename && (
          <DownloadTableToTsvButton
            selector={tsvSelector}
            filename={tsvFilename}
          />
        )}

      {CreateSetButton &&
        RemoveFromSetButton &&
        AppendSetButton &&
        idField && (
          <SetActions
            total={total}
            filters={currentFilters}
            score={score}
            sort={sort}
            CreateSetButton={CreateSetButton}
            AppendSetButton={AppendSetButton}
            RemoveFromSetButton={RemoveFromSetButton}
            field={idField}
            type={type}
            displayType={displayType}
            selectedIds={selectedIds || []}
            scope={scope}
          />
        )}
    </Row>
  );
};

export default enhance(TableActions);
