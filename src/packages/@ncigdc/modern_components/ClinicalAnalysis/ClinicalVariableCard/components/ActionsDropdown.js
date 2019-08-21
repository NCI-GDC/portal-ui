import React from 'react';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import { get } from 'lodash';

import Dropdown from '@ncigdc/uikit/Dropdown';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import { setModal } from '@ncigdc/dux/modal';
import RemoveSetModal from '@ncigdc/components/Modals/RemoveSetModal';
import SaveSetModal from '@ncigdc/components/Modals/SaveSetModal';
import AppendSetModal from '@ncigdc/components/Modals/AppendSetModal';
import {
  AppendExploreCaseSetButton,
  CreateExploreCaseSetButton,
  RemoveFromExploreCaseSetButton,
} from '@ncigdc/modern_components/withSetAction';
import { downloadToTSV } from '@ncigdc/components/DownloadTableToTsvButton';
import { Row } from '@ncigdc/uikit/Flex';
import timestamp from '@ncigdc/utils/timestamp';

const ActionsDropdown = ({
  active_chart,
  cardFilters,
  currentAnalysis,
  dispatch,
  selectedBins,
  styles,
  theme,
  totalDocs,
  tsvSubstring,
}) => {
  // set action will default to cohort total when no bins are selected
  const totalFromSelectedBins = selectedBins && selectedBins.length
    ? selectedBins.reduce((acc, bin) => acc + bin.chart_doc_count, 0)
    : totalDocs;
  const setActionsDisabled = get(selectedBins, 'length', 0) === 0;
  return (
    <Dropdown
      button={(
        <Button
          rightIcon={<DownCaretIcon />}
          style={{
            ...visualizingButton,
            padding: '0 12px',
          }}
          >
      Select Action
        </Button>
      )}
      dropdownStyle={{
        left: 0,
        minWidth: 205,
      }}
      >
      {active_chart === 'box' || [
        <DropdownItem
          key="save-set"
          style={{
            ...styles.actionMenuItem,
            ...setActionsDisabled ? styles.actionMenuItemDisabled(theme) : {},
          }}
          >
          <Row
            onClick={() => setActionsDisabled || dispatch(setModal(
              <SaveSetModal
                CreateSetButton={CreateExploreCaseSetButton}
                displayType="case"
                filters={cardFilters}
                score="gene.gene_id"
                setName="Custom Case Selection"
                sort={null}
                title={`Save ${totalFromSelectedBins} Cases as New Set`}
                total={totalFromSelectedBins}
                type="case"
                />
            ))}
            >
            Save as new case set
          </Row>
        </DropdownItem>,
        <DropdownItem
          key="append-set"
          style={{
            ...styles.actionMenuItem,
            ...setActionsDisabled
              ? styles.actionMenuItemDisabled(theme)
              : {},
          }}
          >
          <Row
            onClick={() => setActionsDisabled || dispatch(setModal(
              <AppendSetModal
                AppendSetButton={AppendExploreCaseSetButton}
                displayType="case"
                field="cases.case_id"
                filters={cardFilters}
                scope="explore"
                score="gene.gene_id"
                sort={null}
                title={`Add ${totalFromSelectedBins} Cases to Existing Set`}
                total={totalFromSelectedBins}
                type="case"
                />
            ))}
            >
            Add to existing case set
          </Row>
        </DropdownItem>,
        <DropdownItem
          key="remove-set"
          style={Object.assign(
            {},
            styles.actionMenuItem,
            setActionsDisabled
              ? styles.actionMenuItemDisabled(theme)
              : {},
          )}
          >
          <Row
            onClick={() => setActionsDisabled || dispatch(setModal(
              <RemoveSetModal
                enableDragging
                field="cases.case_id"
                filters={cardFilters}
                RemoveFromSetButton={RemoveFromExploreCaseSetButton}
                selected={Object.keys(get(currentAnalysis, 'sets.case', {}))[0] || ''}
                title={`Remove ${totalFromSelectedBins} Cases from Existing Set`}
                type="case"
                />
            ))}
            >
            Remove from existing case set
          </Row>
        </DropdownItem>,
      ]}

      <DropdownItem
        key="tsv"
        onClick={() => downloadToTSV({
          excludedColumns: ['Select'],
          filename: `analysis-${
            currentAnalysis.name}-${tsvSubstring}.${timestamp()}.tsv`,
          selector: `#analysis-${tsvSubstring}-table`,
        })}
        style={{
          ...styles.actionMenuItem,
          borderTop: active_chart !== 'box'
            ? `1px solid ${theme.greyScale5}`
            : '',
        }}
        >
        Export TSV
      </DropdownItem>
    </Dropdown>
  );
};

export default ActionsDropdown;
