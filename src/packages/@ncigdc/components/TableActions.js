/* @flow */

import React from "react";
import urlJoin from "url-join";

import { Row } from "@ncigdc/uikit/Flex";
import { Tooltip } from "@ncigdc/uikit/Tooltip";
import { parseFilterParam } from "@ncigdc/utils/uri";
import DownloadButton from "@ncigdc/components/DownloadButton";
import ArrangeColumnsButton from "@ncigdc/components/ArrangeColumnsButton";
import SortTableButton from "@ncigdc/components/SortTableButton";
import LocationSubscriber from "@ncigdc/components/LocationSubscriber";

import type { TRawQuery } from "@ncigdc/utils/uri/types";
import { visualizingButton } from "@ncigdc/theme/mixins";
import DownloadTableToTsvButton
  from "@ncigdc/components/DownloadTableToTsvButton";
import type { TGroupFilter } from "@ncigdc/utils/filters/types";

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
  currentFilters?: TGroupFilter
};

function jsonDownloadTooltip(excepts) {
  const len = excepts.length;
  const last = excepts[len - 1];
  return `Export All${len ? ` Except ${len === 1 ? last : excepts
            .slice(0, -1)
            .join(", ") + " and " + last}` : ""}`;
}
const TableActions = (
  {
    prefix,
    total = 10000,
    sortOptions,
    sortKey,
    endpoint,
    downloadFields,
    downloadable = true,
    entityType = "",
    tsvSelector,
    tsvFilename,
    style,
    currentFilters,
    nonDownloadableColumns = []
  }: TProps = {}
) => (
  <LocationSubscriber>
    {({ query }: {| query: TRawQuery |}) => (
      <Row style={style} spacing="0.2rem">
        {entityType &&
          <ArrangeColumnsButton
            entityType={entityType}
            style={visualizingButton}
          />}
        {sortOptions &&
          sortKey &&
          <SortTableButton
            options={sortOptions}
            query={query || {}}
            sortKey={sortKey}
            style={visualizingButton}
          />}
        {downloadable &&
          <Tooltip
            Component={
              <span>{jsonDownloadTooltip(nonDownloadableColumns)}</span>
            }
          >
            <DownloadButton
              filters={
                currentFilters || parseFilterParam((query || {}).filters, {})
              }
              disabled={!total}
              filename={prefix}
              url={urlJoin(process.env.REACT_APP_API, endpoint)}
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
      </Row>
    )}
  </LocationSubscriber>
);

export default TableActions;
