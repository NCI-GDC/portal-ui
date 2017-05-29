/* @flow */

import React from 'react';
import urlJoin from 'url-join';

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

declare var API: string;

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

const TableActions = ({
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
}: TProps = {}) => (
  <LocationSubscriber>
    {
      ({ query }: {| query: TRawQuery |}) => (
        <Row style={style}>
          {entityType &&
            <ArrangeColumnsButton
              entityType={entityType}
              style={visualizingButton}
            />
          }
          {sortOptions && sortKey &&
            (
              <SortTableButton
                options={sortOptions}
                query={query || {}}
                sortKey={sortKey}
                style={visualizingButton}
              />
            )
          }
          {downloadable &&
            (
              <Tooltip Component={<span>Export Table</span>}>
                <DownloadButton
                  filters={currentFilters || parseFilterParam((query || {}).filters, {})}
                  disabled={!total}
                  filename={prefix}
                  url={urlJoin(API, endpoint)}
                  fields={downloadFields}
                  style={visualizingButton}
                  size={total}
                />
              </Tooltip>
            )
          }
          {tsvSelector && tsvFilename &&
            <DownloadTableToTsvButton
              selector={tsvSelector}
              filename={tsvFilename}
              style={{ marginLeft: '0.2rem' }}
            />
          }
        </Row>
      )
    }
  </LocationSubscriber>
);

export default TableActions;
