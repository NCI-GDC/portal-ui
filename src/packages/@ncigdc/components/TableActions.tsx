import ArrangeColumnsButton from '@ncigdc/components/ArrangeColumnsButton';
import DownloadBiospecimenDropdown from '@ncigdc/modern_components/DownloadBiospecimenDropdown';
import DownloadButton from '@ncigdc/components/DownloadButton';
import DownloadClinicalDropdown from '@ncigdc/modern_components/DownloadClinicalDropdown';
import DownloadTableToTsvButton from '@ncigdc/components/DownloadTableToTsvButton';
import pluralize from '@ncigdc/utils/pluralize';
import React from 'react';
import SetActions from '@ncigdc/components/SetActions';
import timestamp from '@ncigdc/utils/timestamp';
import withRouter from '@ncigdc/utils/withRouter';
import { compose, withState } from 'recompose';
import { IGroupFilter } from '@ncigdc/utils/filters/types';
import { IRawQuery } from '@ncigdc/utils/uri/types';
import { mergeQuery } from '@ncigdc/utils/filters';
import { parseFilterParam, parseJSONParam, stringifyJSONParam } from '@ncigdc/utils/uri';
import { Row } from '@ncigdc/uikit/Flex';

import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { withTheme } from '@ncigdc/theme';
import SortTableButton, {
  ISortTableOption,
  TSortTableButtonSortFunc,
} from '@ncigdc/components/SortTableButton';

type TTableSortFuncCreator = (
  q: IRawQuery,
  sk: string,
  p: ({}) => void
) => TSortTableButtonSortFunc;
const tableSortFuncCreator: TTableSortFuncCreator = (
  query,
  sortKey,
  push
) => selectedSort => {
  // Construct the new query by merging existing filters/query
  const newQuery = mergeQuery(
    { [sortKey]: stringifyJSONParam(selectedSort) },
    query,
    true
  );

  // If there are filters the stringify them otherwise remove the key
  if (Object.keys(newQuery.filters || {}).length > 0) {
    newQuery.filters = stringifyJSONParam(newQuery.filters);
  } else {
    delete newQuery.filters;
  }

  // Push the new query
  push({ query: newQuery });
};

interface IProps {
  type: string;
  total: number;
  endpoint: string;
  downloadFields: string[];
  query?: IRawQuery;
  push?: ({}) => void;
  displayType?: string;
  arrangeColumnKey?: string;
  currentFilters: IGroupFilter;
  sortOptions?: ISortTableOption[];
  downloadable?: boolean;
  tsvSelector?: string;
  tsvFilename?: string;
  style?: React.CSSProperties;
  CreateSetButton?: React.ComponentType;
  RemoveFromSetButton?: React.ComponentType;
  idField?: string;
  selectedIds?: string[];
  theme?: object;
  totalCases?: number;
  // Todo: type these properly
  downloadTooltip?: string | JSX.Element;
  sort?: { field: string; order: string };
  score?: string;
  scope?: string;
  AppendSetButton?: React.ComponentClass;
  downloadClinical?: boolean;
  downloadBiospecimen?: boolean;
  hideColumns?: string[];
}

const TableActions: React.SFC<IProps> = ({
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
  downloadTooltip = 'Export All',
  CreateSetButton,
  RemoveFromSetButton,
  idField,
  query = {},
  push = () => {},
  selectedIds,
  sort,
  score,
  AppendSetButton,
  scope,
  downloadClinical,
  downloadBiospecimen,
  theme,
  totalCases,
  hideColumns,
}: IProps) => {
  const fieldContains = ({
    filters,
    field,
  }: {
    filters: IGroupFilter;
    field: string;
  }) => {
    return ((filters || {}).content || []).some(f => f.content.field.includes(field));
  };
  return (
    <Row className="test-table-actions" spacing="0.2rem" style={style}>
      {arrangeColumnKey && (
        <ArrangeColumnsButton
          entityType={arrangeColumnKey}
          hideColumns={hideColumns}
          style={visualizingButton} />
      )}
      {sortOptions && (
        <SortTableButton
          initialState={
            query[`${type}s_sort`]
              ? { sortSelection: parseJSONParam(query[`${type}s_sort`]) }
              : { sortSelection: [] }
          }
          isDisabled={!sortOptions.length}
          options={sortOptions}
          sortFunction={tableSortFuncCreator(query, `${type}s_sort`, push)}
          style={visualizingButton} />
      )}
      {downloadBiospecimen && (
        <DownloadBiospecimenDropdown
          buttonStyles={visualizingButton}
          filters={
            currentFilters || parseFilterParam((query || {}).filters, {})
          }
          inactiveText="Biospecimen"
          jsonFilename={`biospecimen.cases_selection.${timestamp()}.json`}
          selectedIds={selectedIds}
          shouldCreateSet={
            (scope === 'explore' &&
              fieldContains({
                filters: { ...currentFilters },
                field: 'gene',
              })) ||
            fieldContains({
              filters: { ...currentFilters },
              field: 'ssms',
            })
          }
          tsvFilename={`biospecimen.cases_selection.${timestamp()}.tar.gz`} />
      )}
      {downloadClinical && (
        <DownloadClinicalDropdown
          buttonStyles={visualizingButton}
          filters={
            currentFilters || parseFilterParam((query || {}).filters, {})
          }
          inactiveText="Clinical"
          jsonFilename={`clinical.cases_selection.${timestamp()}.json`}
          scope={scope}
          selectedIds={selectedIds}
          tsvFilename={`clinical.cases_selection.${timestamp()}.tar.gz`} />
      )}
      {downloadable && (
        <Tooltip Component={downloadTooltip}>
          <DownloadButton
            activeText="JSON"
            disabled={!total}
            endpoint={endpoint}
            fields={downloadFields}
            filename={`${pluralize(displayType, total)}.${timestamp()}.json`}
            filters={
              currentFilters || parseFilterParam((query || {}).filters, {})
            }
            inactiveText="JSON"
            showIcon={false}
            size={total}
            style={visualizingButton} />
        </Tooltip>
      )}
      {tsvSelector &&
        tsvFilename && (
        <DownloadTableToTsvButton
          filename={tsvFilename}
          selector={tsvSelector} />
      )}

      {CreateSetButton &&
        RemoveFromSetButton &&
        AppendSetButton &&
        idField && (
        <SetActions
          AppendSetButton={AppendSetButton}
          CreateSetButton={CreateSetButton}
          displayType={displayType}
          field={idField}
          filters={currentFilters}
          RemoveFromSetButton={RemoveFromSetButton}
          scope={scope}
          score={score}
          selectedIds={selectedIds || []}
          sort={sort}
          total={total}
          type={type} />
      )}
    </Row>
  );
};

export default compose<IProps, IProps>(
  withRouter,
  withState('state', 'setState', {
    tsvDownloading: false,
    jsonDownloading: false,
  }),
  withTheme
)(TableActions);
