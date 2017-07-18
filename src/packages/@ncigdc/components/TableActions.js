/* @flow */

import React from 'react';

import { Row } from '@ncigdc/uikit/Flex';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { parseFilterParam } from '@ncigdc/utils/uri';
import DownloadButton from '@ncigdc/components/DownloadButton';
import ArrangeColumnsButton from '@ncigdc/components/ArrangeColumnsButton';
import SortTableButton from '@ncigdc/components/SortTableButton';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';

import type { TRawQuery } from '@ncigdc/utils/uri/types';
import { visualizingButton } from '@ncigdc/theme/mixins';
import DownloadTableToTsvButton from '@ncigdc/components/DownloadTableToTsvButton';
import type { TGroupFilter } from '@ncigdc/utils/filters/types';

type TProps = {
  prefix: string,
  total: number,
  sortOptions?: Array<Object>,
  sortKey?: string,
  endpoint: string,
  entityType?: string,
  downloadFields: Array<string>,
  downloadable?: boolean,
  tsvSelector?: string,
  tsvFilename?: string,
  style?: Object,
  currentFilters?: TGroupFilter,
};

const TableActions = (
  {
    prefix,
    total = 10000,
    sortOptions,
    sortKey,
    endpoint,
    downloadFields,
    downloadable = true,
    entityType = '',
    tsvSelector,
    tsvFilename,
    style,
    currentFilters,
    downloadTooltip = 'Export All',
  }: TProps = {},
) =>
  <LocationSubscriber>
    {({ query }: {| query: TRawQuery |}) =>
      <Row style={style} spacing="0.2rem" data-test="table-actions">
        {entityType &&
          <ArrangeColumnsButton
            entityType={entityType}
            style={visualizingButton}
          />}
        {sortOptions &&
          sortKey &&
          <SortTableButton
            isDisabled={!sortOptions.length}
            options={sortOptions}
            query={query || {}}
            sortKey={sortKey}
            style={visualizingButton}
          />}
        {downloadable &&
          <Tooltip Component={downloadTooltip}>
            <DownloadButton
              filters={
                currentFilters || parseFilterParam((query || {}).filters, {})
              }
              disabled={!total}
              filename={prefix}
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
      </Row>}
  </LocationSubscriber>;

export default TableActions;
