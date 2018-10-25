import ArrangeColumnsButton from '@ncigdc/components/ArrangeColumnsButton';
import DownloadBiospecimenDropdown from '@ncigdc/modern_components/DownloadBiospecimenDropdown';
import DownloadButton from '@ncigdc/components/DownloadButton';
import DownloadClinicalDropdown from '@ncigdc/modern_components/DownloadClinicalDropdown';
import DownloadTableToTsvButton from '@ncigdc/components/DownloadTableToTsvButton';
import pluralize from '@ncigdc/utils/pluralize';
import React from 'react';
import SetActions from '@ncigdc/components/SetActions';
import SortTableButton from '@ncigdc/components/SortTableButton';
import timestamp from '@ncigdc/utils/timestamp';
import withRouter from '@ncigdc/utils/withRouter';
import { compose, withState } from 'recompose';
import { parseFilterParam } from '@ncigdc/utils/uri';
import { Row } from '@ncigdc/uikit/Flex';
import { IGroupFilter } from '@ncigdc/utils/filters/types';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { IRawQuery } from '@ncigdc/utils/uri/types';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { withTheme } from '@ncigdc/theme';

interface IProps {
  type: string;
  displayType?: string;
  arrangeColumnKey?: string;
  total: number;
  sortOptions?: object[];
  endpoint: string;
  downloadFields: string[];
  downloadable?: boolean;
  tsvSelector?: string;
  tsvFilename?: string;
  style?: object;
  currentFilters?: IGroupFilter;
  downloadTooltip?: any;
  CreateSetButton?: React.SFC;
  RemoveFromSetButton?: React.SFC;
  idField?: string;
  query: IRawQuery;
  selectedIds?: string[];
  sort?: any;
  score?: any;
  AppendSetButton?: any;
  scope?: any;
  downloadClinical?: any;
  downloadBiospecimen?: any;
  theme?: object;
  totalCases?: number;
}

const enhance = compose(
  withRouter,
  withState('state', 'setState', {
    tsvDownloading: false,
    jsonDownloading: false,
  }),
  withTheme
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
  downloadTooltip = 'Export All',
  CreateSetButton,
  RemoveFromSetButton,
  idField,
  query,
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
          isDisabled={!sortOptions.length}
          options={sortOptions}
          query={query || {}}
          sortKey={`${type}s_sort`}
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
              fieldContains({ currentFilters, field: 'gene' })) ||
            fieldContains({ currentFilters, field: 'ssms' })
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

export default enhance(TableActions);
