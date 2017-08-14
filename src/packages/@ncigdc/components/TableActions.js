/* @flow */

import React from 'react';

import { Row } from '@ncigdc/uikit/Flex';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { parseFilterParam } from '@ncigdc/utils/uri';
import DownloadButton from '@ncigdc/components/DownloadButton';
import ArrangeColumnsButton from '@ncigdc/components/ArrangeColumnsButton';
import SortTableButton from '@ncigdc/components/SortTableButton';

import { visualizingButton } from '@ncigdc/theme/mixins';
import DownloadTableToTsvButton from '@ncigdc/components/DownloadTableToTsvButton';
import type { TGroupFilter } from '@ncigdc/utils/filters/types';
import SetActions from '@ncigdc/components/SetActions';
import { compose } from 'recompose';
import withRouter from '@ncigdc/utils/withRouter';

import type { TRawQuery } from '@ncigdc/utils/uri/types';

type TProps = {
  type: string,
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

const enhance = compose(withRouter);

const TableActions = ({
  type,
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
  downloadTooltip = 'Export All',
  CreateSetButton,
  RemoveFromSetButton,
  idField,
  query,
  selectedIds,
}: TProps) => {
  return (
    <Row style={style} spacing="0.2rem" className="test-table-actions">
      {arrangeColumnKey &&
        <ArrangeColumnsButton
          entityType={arrangeColumnKey}
          style={visualizingButton}
        />}
      {sortOptions &&
        <SortTableButton
          isDisabled={!sortOptions.length}
          options={sortOptions}
          query={query || {}}
          sortKey={`${type}_sort`}
          style={visualizingButton}
        />}
      {downloadable &&
        <Tooltip Component={downloadTooltip}>
          <DownloadButton
            filters={
              currentFilters || parseFilterParam((query || {}).filters, {})
            }
            disabled={!total}
            filename={`${type}s`}
            endpoint={endpoint}
            fields={downloadFields}
            style={visualizingButton}
            size={total}
            inactiveText="JSON"
            activeText="JSON"
            showIcon={false}
          />
        </Tooltip>}
      {tsvSelector &&
        tsvFilename &&
        <DownloadTableToTsvButton
          selector={tsvSelector}
          filename={tsvFilename}
        />}

      {CreateSetButton &&
        RemoveFromSetButton &&
        idField &&
        <SetActions
          total={total}
          filters={currentFilters}
          CreateSetButton={CreateSetButton}
          RemoveFromSetButton={RemoveFromSetButton}
          field={idField}
          type={type}
          selectedIds={selectedIds || []}
        />}
    </Row>
  );
};

export default enhance(TableActions);
