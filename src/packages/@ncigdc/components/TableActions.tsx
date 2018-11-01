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
import { parseFilterParam } from '@ncigdc/utils/uri';
import { Row } from '@ncigdc/uikit/Flex';
import { parseJSONParam, stringifyJSONParam } from '@ncigdc/utils/uri';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { withTheme } from '@ncigdc/theme';
import SortTableButton, {
  ISortTableOptions,
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
    newQuery.filters = stringifyJSONParam(newQuery.filters)
  } else {
    delete newQuery.filters;
  }

  // Push the new query
  push({query: newQuery});
};

interface IProps {
  type: string;
  total: number;
  endpoint: string;
  downloadFields: string[];
  query: IRawQuery;
  push: ({}) => void;
  displayType?: string;
  arrangeColumnKey?: string;
  currentFilters: IGroupFilter;
  sortOptions?: ISortTableOptions[];
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
  downloadTooltip?: any;
  sort?: any;
  score?: any;
  scope?: any;
  AppendSetButton?: any;
  downloadClinical?: any;
  downloadBiospecimen?: any;
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
  query,
  push,
  selectedIds,
  sort,
  score,
  AppendSetButton,
  scope,
  downloadClinical,
  downloadBiospecimen,
  theme,
  totalCases,
}: IProps) => {
  const fieldContains = ({
    filters,
    field,
  }: {
    filters: IGroupFilter;
    field: string;
  }) => {
    return ((filters || {}).content || []).some(f =>
      f.content.field.includes(field)
    );
  };
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
          sortFunction={tableSortFuncCreator(query, `${type}s_sort`, push)}
          options={sortOptions}
          initialState={query[`${type}s_sort`] ? {sortSelection: parseJSONParam(query[`${type}s_sort`])} : {sortSelection: []}}
          isDisabled={!sortOptions.length}
          style={visualizingButton}
        />
      )}
      {downloadBiospecimen && (
        <DownloadBiospecimenDropdown
          jsonFilename={`biospecimen.cases_selection.${timestamp()}.json`}
          tsvFilename={`biospecimen.cases_selection.${timestamp()}.tar.gz`}
          filters={
            currentFilters || parseFilterParam((query || {}).filters, {})
          }
          buttonStyles={visualizingButton}
          inactiveText={'Biospecimen'}
          shouldCreateSet={
            (scope === 'explore' &&
              fieldContains({
                filters: { ...currentFilters },
                field: 'gene',
              })) ||
            fieldContains({ filters: { ...currentFilters }, field: 'ssms' })
          }
          selectedIds={selectedIds}
        />
      )}
      {downloadClinical && (
        <DownloadClinicalDropdown
          buttonStyles={visualizingButton}
          tsvFilename={`clinical.cases_selection.${timestamp()}.tar.gz`}
          jsonFilename={`clinical.cases_selection.${timestamp()}.json`}
          filters={
            currentFilters || parseFilterParam((query || {}).filters, {})
          }
          inactiveText={'Clinical'}
          scope={scope}
          selectedIds={selectedIds}
        />
      )}
      {downloadable && (
        <Tooltip Component={downloadTooltip}>
          <DownloadButton
            filters={
              currentFilters || parseFilterParam((query || {}).filters, {})
            }
            disabled={!total}
            filename={`${pluralize(displayType, total)}.${timestamp()}.json`}
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

export default compose(
  withRouter,
  withState('state', 'setState', {
    tsvDownloading: false,
    jsonDownloading: false,
  }),
  withTheme
)(TableActions);
