/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  withState,
  withProps,
  branch,
  renderComponent,
} from 'recompose';
import { map, reduce, xor, find, get, omit } from 'lodash';
import moment from 'moment';

import { notify } from '@ncigdc/dux/notification';
import { closeNotification } from '@ncigdc/dux/notification';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import styled from '@ncigdc/theme/styled';
import { addSet, removeSet, updateSet } from '@ncigdc/dux/sets';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import RepositoryLink from '@ncigdc/components/Links/RepositoryLink';
import countComponents from '@ncigdc/modern_components/Counts';
import { Column, Row } from '@ncigdc/uikit/Flex';
import Heading from '@ncigdc/uikit/Heading';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
import Button from '@ncigdc/uikit/Button';
import EditableLabel from '@ncigdc/uikit/EditableLabel';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { ExclamationTriangleIcon } from '@ncigdc/theme/icons';
import DatabaseIcon from '@ncigdc/theme/icons/Database';
import UnstyledButton from '@ncigdc/uikit/UnstyledButton';
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
import { zDepth1 } from '@ncigdc/theme/mixins';
import Aux from '@ncigdc/utils/Aux';

const fields = {
  case: 'cases.case_id',
  gene: 'genes.gene_id',
  ssm: 'ssms.ssm_id',
};

const Info = () => (
  <span>
    <Heading>Manage Your Saved Sets</Heading>
    <p>
      You can create and save case, gene and mutation sets of interest from the{' '}
      <ExploreLink>Exploration Page</ExploreLink>.
    </p>
  </span>
);

const UploadSet = connect()(({ dispatch }) => (
  <Aux>
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
  </Aux>
));

const enhance = compose(
  connect(({ sets }) => ({ sets })),
  withState('selectedIds', 'setSelectedIds', []),
  withState('setSizes', 'setSetSizes', {}),
  withPropsOnChange(['sets'], ({ setSelectedIds }) => setSelectedIds([])),
  withProps(
    ({
      sets,
      selectedIds,
      setSelectedIds,
      dispatch,
      setSizes,
      setSetSizes,
      flattenedSets,
    }) => ({
      flattenedSets: reduce(
        sets,
        (acc, setsOfType, type) => [
          ...acc,
          ...map(setsOfType, (label, id) => ({
            type,
            label,
            filenameSafeLabel: label.replace(/[^A-Za-z0-9_.]/g, '_'),
            id,
            filters: {
              op: '=',
              content: {
                field: fields[type],
                value: `set_id:${id}`,
              },
            },
            linkFilters: {
              op: 'and',
              content: [
                {
                  op: 'in',
                  content: {
                    field: fields[type],
                    value: [`set_id:${id}`],
                  },
                },
              ],
            },
          })),
        ],
        [],
      ).map(({ filters, type, id, ...rest }) => ({
        filters,
        type,
        id,
        ...rest,
        countComponent: countComponents[type]({
          filters,
          handleCountChange: count =>
            setSetSizes({
              ...setSizes,
              [id]: count,
            }),
        }),
      })),
    }),
  ),
  branch(
    p => p.flattenedSets.length === 0,
    renderComponent(({ dispatch }) => (
      <Row
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 200,
        }}
      >
        <Column
          style={{
            alignItems: 'center',
            backgroundColor: 'white',
            padding: '20px',
            ...zDepth1,
          }}
        >
          <Info />
          <UploadSet />
        </Column>
      </Row>
    )),
  ),
);

const StyledRepoLink = styled(RepositoryLink, {
  marginLeft: '5px',
  ...iconLink,
});

const ManageSetsPage = ({
  sets,
  selectedIds,
  setSelectedIds,
  dispatch,
  setSizes,
  setSetSizes,
  flattenedSets,
}) => {
  const allSelected =
    selectedIds.length !== 0 && flattenedSets.length === selectedIds.length;
  const emptyOrDeprecatedSets = Object.keys(setSizes).filter(
    id => get(setSizes, id) === 0,
  );

  const doneFetchingSetSizes =
    flattenedSets.length !== 0 &&
    flattenedSets.every(({ id }) => typeof setSizes[id] === 'number');

  return (
    <Column style={{ padding: '2rem 2.5rem 13rem' }}>
      <Info />

      <Row>
        <UploadSet />

        {flattenedSets.length !== 0 && (
          <DownloadButton
            className="test-download-set-all-tar"
            endpoint="/tar_sets"
            inactiveText="Export selected"
            activeText="Exporting selected"
            altMessage={false}
            setParentState={() => {}}
            active={false}
            style={{ marginBottom: '1rem', marginLeft: '1rem' }}
            disabled={selectedIds.length === 0}
            sets={flattenedSets.reduce(
              (acc, { type, filters, label, filenameSafeLabel, id }) => {
                if (selectedIds.includes(id)) {
                  return [
                    ...acc,
                    {
                      id,
                      type,
                      filename:
                        flattenedSets.length === 1
                          ? `${type}_set_${filenameSafeLabel}_${moment().format(
                              'YYYY-MM-DD:hh:mm:ss',
                            )}.tsv`
                          : `${type}_${filenameSafeLabel}.tsv`,
                    },
                  ];
                }
                return acc;
              },
              [],
            )}
            filename={`gdc_sets_${moment().format(
              'YYYY-MM-DD-hh-mm-ss',
            )}.tar.gz`}
          />
        )}

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
                            dispatch(closeNotification());
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
                emptyOrDeprecatedSets.map(currentSetId =>
                  dispatch(
                    removeSet({
                      type: find(flattenedSets, ({ id }) => currentSetId === id)
                        .type,
                      id: currentSetId,
                    }),
                  ),
                );
                setSetSizes(omit(setSizes, emptyOrDeprecatedSets));
              }}
              style={{ marginBottom: '1rem', marginLeft: '1rem' }}
            >
              Delete Empty or Deprecated
            </Button>
          )}
      </Row>

      {flattenedSets.length > 0 && (
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
                  aria-label="Select all"
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
                  (
                    {
                      id,
                      label,
                      type,
                      filters,
                      linkFilters,
                      countComponent,
                      filenameSafeLabel,
                    },
                    i,
                  ) => (
                    <Tr key={id} index={i}>
                      <Td key={`checkbox${i}`} style={{ width: '50px' }}>
                        <input
                          type="checkbox"
                          aria-label={`Select ${id}`}
                          checked={selectedIds.includes(id)}
                          onChange={e => setSelectedIds(xor(selectedIds, [id]))}
                        />
                        {doneFetchingSetSizes &&
                          !get(setSizes, id) && (
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
                        {get(setSizes, id) > 0 ? (
                          <ExploreLink
                            query={{
                              searchTableTab:
                                (type === 'ssm' ? 'mutation' : type) + 's',
                              filters: linkFilters,
                            }}
                          >
                            {countComponent}
                          </ExploreLink>
                        ) : (
                          <span>{countComponent}</span>
                        )}
                      </Td>
                      <Td>
                        {doneFetchingSetSizes &&
                          get(setSizes, id) > 0 && (
                            <Row>
                              <Tooltip Component="Export as TSV">
                                <DownloadButton
                                  className="test-download-set-tsv"
                                  style={iconButton}
                                  endpoint="/tar_sets"
                                  activeText="" //intentionally blank
                                  inactiveText="" //intentionally blank
                                  altMessage={false}
                                  setParentState={() => {}}
                                  active={false}
                                  sets={[
                                    {
                                      id,
                                      type,
                                      filename: `${type}_set_${filenameSafeLabel}_${moment().format(
                                        'YYYY-MM-DD:hh:mm:ss',
                                      )}.tsv`,
                                    },
                                  ]}
                                />
                              </Tooltip>
                              {type === 'case' && (
                                <Tooltip Component="View Files in Repository">
                                  <StyledRepoLink
                                    aria-label="View Files in Repository"
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
