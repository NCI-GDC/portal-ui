/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { map, reduce, xor, find } from 'lodash';

import { notify } from '@ncigdc/dux/notification';
import { closeNotification } from '@ncigdc/dux/notification';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import styled from '@ncigdc/theme/styled';
import { addSet, removeSet, updateSet } from '@ncigdc/dux/sets';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import RepositoryLink from '@ncigdc/components/Links/RepositoryLink';
import { withCounts } from '@ncigdc/modern_components/Counts';
import { Column, Row } from '@ncigdc/uikit/Flex';
import Heading from '@ncigdc/uikit/Heading';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
import Button from '@ncigdc/uikit/Button';
import EditableLabel from '@ncigdc/uikit/EditableLabel';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { ExclamationTriangleIcon } from '@ncigdc/theme/icons';
import DatabaseIcon from '@ncigdc/theme/icons/Database';
import UnstyledButton from '@ncigdc/uikit/UnstyledButton';
import { SET_DOWNLOAD_FIELDS as downloadFields } from '@ncigdc/utils/constants';
import DownloadButton from '@ncigdc/components/DownloadButton';
import { iconButton, iconLink } from '@ncigdc/theme/mixins';
import {
  UploadCaseSet,
  UploadGeneSet,
  UploadSsmSet,
} from '@ncigdc/components/Modals/UploadSet';
import { setModal } from '@ncigdc/dux/modal';
import { CreateRepositoryCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import { CreateExploreGeneSetButton } from '@ncigdc/modern_components/withSetAction';
import { CreateExploreSsmSetButton } from '@ncigdc/modern_components/withSetAction';
import { UploadAndSaveSetModal } from '@ncigdc/components/Modals/SaveSetModal';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';

const fields = {
  case: 'cases.case_id',
  gene: 'genes.gene_id',
  ssm: 'ssms.ssm_id',
};

const enhance = compose(
  connect(({ sets }) => ({
    flattenedSets: reduce(
      sets,
      (acc, setsOfType, type) => [
        ...acc,
        ...map(setsOfType, (label, id) => ({
          type,
          label,
          id,
          filters: {
            op: '=',
            content: { field: fields[type], value: `set_id:${id}` },
          },
          linkFilters: {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: fields[type], value: [`set_id:${id}`] },
              },
            ],
          },
        })),
      ],
      [],
    ),
  })),
  withCounts('counts', ({ flattenedSets }) =>
    flattenedSets.map(({ type, filters }) => ({
      type: type,
      scope: 'explore',
      filters: filters,
    })),
  ),
  withState('selectedIds', 'setSelectedIds', []),
  withPropsOnChange(['flattenedSets'], ({ setSelectedIds }) =>
    setSelectedIds([]),
  ),
);

const StyledRepoLink = styled(RepositoryLink, {
  marginLeft: '5px',
  ...iconLink,
});

const ManageSetsPage = ({
  flattenedSets,
  selectedIds,
  setSelectedIds,
  dispatch,
  counts,
}) => {
  const allSelected =
    selectedIds.length !== 0 && flattenedSets.length === selectedIds.length;
  const emptyOrDeprecatedSets = flattenedSets.filter((s, i) => counts[i] === 0);

  const doneFetchingSetSizes =
    flattenedSets.length !== 0 &&
    flattenedSets.every((s, i) => typeof counts[i] === 'number');

  return (
    <Column style={{ padding: '2rem 2.5rem 13rem' }}>
      <Heading>Manage Your Saved Sets</Heading>
      <p>
        You can create and save case, gene and mutation sets of interest from
        the <ExploreLink>Exploration Page</ExploreLink>.
      </p>

      <Row>
        <Dropdown
          button={<Button rightIcon={<DownCaretIcon />}>Upload Set</Button>}
          dropdownStyle={{
            marginTop: 5,
            whiteSpace: 'nowrap',
            right: 'auto',
          }}
        >
          <DropdownItem
            style={{ cursor: 'pointer' }}
            onClick={() =>
              dispatch(
                setModal(
                  <UploadAndSaveSetModal
                    type="case"
                    CreateSetButton={CreateRepositoryCaseSetButton}
                    UploadSet={UploadCaseSet}
                  />,
                ),
              )}
          >
            Case
          </DropdownItem>
          <DropdownItem
            style={{ cursor: 'pointer' }}
            onClick={() =>
              dispatch(
                setModal(
                  <UploadAndSaveSetModal
                    type="gene"
                    CreateSetButton={CreateExploreGeneSetButton}
                    UploadSet={UploadGeneSet}
                  />,
                ),
              )}
          >
            Gene
          </DropdownItem>
          <DropdownItem
            style={{ cursor: 'pointer' }}
            onClick={() =>
              dispatch(
                setModal(
                  <UploadAndSaveSetModal
                    type="ssm"
                    CreateSetButton={CreateExploreSsmSetButton}
                    UploadSet={UploadSsmSet}
                  />,
                ),
              )}
          >
            Mutation
          </DropdownItem>
        </Dropdown>

        {flattenedSets.length !== 0 && (
          <Button
            onClick={() => {
              const setsToRemove = selectedIds.map(currentSetId => {
                const set = find(
                  flattenedSets,
                  ({ id }) => id === currentSetId,
                );
                const { type, id, label } = set;
                return {
                  type,
                  id,
                  label,
                };
              });
              setsToRemove.map(set => dispatch(removeSet(set)));
              dispatch(
                notify({
                  id: `${new Date().getTime()}`,
                  component: (
                    <Column>
                      Deleted
                      {selectedIds.length === 1 ? (
                        <span>
                          {' '}
                          set <strong>{setsToRemove[0].label}</strong>
                        </span>
                      ) : (
                        <span>
                          <strong>{setsToRemove.length}</strong> sets
                        </span>
                      )}
                      <strong>
                        <i
                          className="fa fa-undo"
                          style={{
                            marginRight: '0.3rem',
                          }}
                        />
                        <UnstyledButton
                          style={{
                            textDecoration: 'underline',
                          }}
                          onClick={() => {
                            setsToRemove.map(set => dispatch(addSet(set)));
                            dispatch(closeNotification(true));
                          }}
                        >
                          Undo
                        </UnstyledButton>
                      </strong>
                    </Column>
                  ),
                }),
              );
            }}
            style={{ marginBottom: '1rem', marginLeft: '1rem' }}
            disabled={selectedIds.length === 0}
          >
            Delete Selected
          </Button>
        )}
        {flattenedSets.length !== 0 &&
          doneFetchingSetSizes &&
          emptyOrDeprecatedSets.length > 0 && (
            <Button
              onClick={() => {
                emptyOrDeprecatedSets.map(({ id, type }) =>
                  dispatch(removeSet({ id, type })),
                );
              }}
              style={{ marginBottom: '1rem', marginLeft: '1rem' }}
            >
              Delete Empty or Deprecated
            </Button>
          )}
      </Row>

      {flattenedSets.length === 0 ? (
        <Row style={{ marginTop: '1rem' }}>No sets</Row>
      ) : (
        <span>
          <Table
            id="manage-sets-table"
            style={{
              maxWidth: '880px',
              paddingLeft: '20px',
              paddingRight: '20px',
            }}
            headings={[
              <Th key="all-checkbox">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={e =>
                    setSelectedIds(
                      allSelected ? [] : flattenedSets.map(({ id }) => id),
                    )}
                />
              </Th>,
              'Entity Type',
              'Name',
              '# Items',
              '',
            ]}
            body={
              <tbody>
                {flattenedSets.map(
                  ({ id, label, type, filters, linkFilters }, i) => (
                    <Tr key={id} index={i}>
                      <Td key={`checkbox${i}`} style={{ width: '50px' }}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(id)}
                          onChange={e => setSelectedIds(xor(selectedIds, [id]))}
                        />
                        {doneFetchingSetSizes &&
                          !counts[i] && (
                            <Tooltip Component="Set is either empty or deprecated.">
                              <ExclamationTriangleIcon
                                style={{ paddingLeft: '5px', color: '#8a6d3b' }}
                              />
                            </Tooltip>
                          )}
                      </Td>
                      <Td
                        key={`type${i}`}
                        style={{
                          width: '100px',
                          textTransform: 'capitalize',
                        }}
                      >
                        {type === 'ssm' ? 'mutations' : type + 's'}
                      </Td>
                      <Td
                        key={`label${i}`}
                        style={{
                          width: '450px',
                          whiteSpace: 'normal',
                        }}
                      >
                        <EditableLabel
                          text={label}
                          handleSave={value =>
                            dispatch(
                              updateSet({
                                type,
                                label: value,
                                id: id,
                              }),
                            )}
                        />
                      </Td>
                      <Td key={`count${i}`}>
                        {counts[i] > 0 ? (
                          <ExploreLink
                            query={{
                              searchTableTab:
                                (type === 'ssm' ? 'mutation' : type) + 's',
                              filters: linkFilters,
                            }}
                          >
                            {counts[i]}
                          </ExploreLink>
                        ) : (
                          <span>{counts[i]}</span>
                        )}
                      </Td>
                      <Td>
                        {doneFetchingSetSizes &&
                          counts[i] > 0 && (
                            <Row>
                              <Tooltip Component="Export as TSV">
                                <DownloadButton
                                  className="test-download-set-tsv"
                                  style={iconButton}
                                  endpoint={`${type}s`}
                                  activeText="" //intentionally blank
                                  inactiveText="" //intentionally blank
                                  altMessage={false}
                                  setParentState={() => {}}
                                  active={false}
                                  filters={filters}
                                  extraParams={{ format: 'tsv' }}
                                  fields={downloadFields[type]}
                                  filename={`set-${label}-ids`}
                                />
                              </Tooltip>
                              {type === 'case' && (
                                <Tooltip Component="View Files in Repository">
                                  <StyledRepoLink
                                    query={{
                                      searchTableTab: 'files',
                                      filters: linkFilters,
                                    }}
                                  >
                                    <DatabaseIcon />
                                  </StyledRepoLink>
                                </Tooltip>
                              )}
                            </Row>
                          )}
                      </Td>
                    </Tr>
                  ),
                )}
              </tbody>
            }
          />

          <p>
            <ExclamationTriangleIcon
              style={{
                paddingLeft: '5px',
                paddingRight: '5px',
                marginTop: '10px',
                color: '#8a6d3b',
              }}
            />
            Please be aware that your custom sets are deleted during each new
            GDC data release.<br />
            You can export them and re-upload them on this page.
          </p>
        </span>
      )}
    </Column>
  );
};

export default enhance(ManageSetsPage);
