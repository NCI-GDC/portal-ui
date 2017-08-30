/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { map, reduce, xor, find, get, omit } from 'lodash';

import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import styled from '@ncigdc/theme/styled';
import { visualizingButton, buttonLike } from '@ncigdc/theme/mixins';
import { removeSet, updateSet } from '@ncigdc/dux/sets';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import RepositoryLink from '@ncigdc/components/Links/RepositoryLink';
import {
  RepositoryCaseCount,
  GeneCount,
} from '@ncigdc/modern_components/Counts';
import { Column, Row } from '@ncigdc/uikit/Flex';
import Heading from '@ncigdc/uikit/Heading';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
import Button from '@ncigdc/uikit/Button';
import EditableLabel from '@ncigdc/uikit/EditableLabel';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { ExclamationTriangleIcon } from '@ncigdc/theme/icons';
import WarningBox from '@ncigdc/uikit/WarningBox';

import DownloadButton from '@ncigdc/components/DownloadButton';

const countComponents = {
  case: RepositoryCaseCount,
  gene: GeneCount,
};

const fields = {
  case: 'cases.case_id',
  gene: 'genes.gene_id',
};

const downloadFields = {
  case: ['submitter_id', 'project.project_id', 'case_id'],
  gene: ['symbol', 'gene_id'],
};

const enhance = compose(
  connect(({ sets }) => ({ sets })),
  withState('selectedIds', 'setSelectedIds', []),
  withState('setSizes', 'setSetSizes', {}),
  withPropsOnChange(['sets'], ({ setSelectedIds }) => setSelectedIds([])),
);

const ButtonLikeRepoLink = styled(RepositoryLink, {
  ...buttonLike,
  ...visualizingButton,
  marginLeft: '5px',
  textDecoration: 'none',
  ':hover': {
    backgroundColor: ({ theme }) => theme.secondary,
    color: ({ theme }) => theme.white,
  },
});

const ManageSetsPage = ({
  sets,
  selectedIds,
  setSelectedIds,
  dispatch,
  setSizes,
  setSetSizes,
}) => {
  const flattenedSets = reduce(
    sets,
    (acc, setsOfType, setType) => [
      ...acc,
      ...map(setsOfType, (setName, setId) => ({
        setType,
        setName,
        setId,
        filters: {
          op: '=',
          content: {
            field: fields[setType],
            value: `set_id:${setId}`,
          },
        },
        linkFilters: {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: fields[setType],
                value: [`set_id:${setId}`],
              },
            },
          ],
        },
      })),
    ],
    [],
  ).map(({ filters, setType, setId, ...rest }) => ({
    filters,
    setType,
    setId,
    ...rest,
    countComponent: countComponents[setType]({
      filters,
      handleCountChange: count =>
        setSetSizes({
          ...setSizes,
          [setId]: count,
        }),
    }),
  }));

  const allSelected =
    selectedIds.length !== 0 && flattenedSets.length === selectedIds.length;
  const emptyOrDeprecatedSets = Object.keys(setSizes).filter(
    setId => get(setSizes, setId) === 0,
  );
  const doneFetchingSetSizes =
    Object.keys(setSizes).length === flattenedSets.length &&
    Object.keys(setSizes).length !== 0;
  return (
    <Column style={{ padding: '2rem 2.5rem 13rem' }}>
      <Heading>
        Manage Sets
      </Heading>
      <p>
        You can create and save case and gene sets of interest from the{' '}
        <ExploreLink>Exploration Page</ExploreLink>.
      </p>
      <WarningBox style={{ marginBottom: '1rem' }}>
        Please be aware that your custom sets are not persisted through GDC data
        releases. You can export them from here, re-upload them in{' '}
        <ExploreLink>Exploration</ExploreLink> and save them again at the next
        GDC data release.
      </WarningBox>
      {flattenedSets.length === 0
        ? <div>No sets</div>
        : <Column>
            <Row>
              <Button
                onClick={() =>
                  selectedIds.map(id =>
                    dispatch(
                      removeSet({
                        type: find(flattenedSets, ({ setId }) => setId === id)
                          .setType,
                        id,
                      }),
                    ),
                  )}
                style={{ marginBottom: '1rem' }}
                disabled={selectedIds.length === 0}
              >
                Delete Selected
              </Button>
              {doneFetchingSetSizes &&
                emptyOrDeprecatedSets.length > 0 &&
                <Button
                  onClick={() => {
                    emptyOrDeprecatedSets.map(id =>
                      dispatch(
                        removeSet({
                          type: find(flattenedSets, ({ setId }) => setId === id)
                            .setType,
                          id,
                        }),
                      ),
                    );
                    setSetSizes(omit(setSizes, emptyOrDeprecatedSets));
                  }}
                  style={{ marginBottom: '1rem', marginLeft: '1rem' }}
                >
                  Delete Empty or Deprecated
                </Button>}
            </Row>
            <Table
              id="manage-sets-table"
              headings={[
                <Th key="all-checkbox">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={e =>
                      setSelectedIds(
                        allSelected
                          ? []
                          : flattenedSets.map(({ setId }) => setId),
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
                        setId,
                        setName,
                        setType,
                        filters,
                        linkFilters,
                        countComponent,
                      },
                      i,
                    ) =>
                      <Tr key={setId} index={i}>
                        <Td key={`checkbox${i}`} style={{ width: '50px' }}>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(setId)}
                            onChange={e =>
                              setSelectedIds(xor(selectedIds, [setId]))}
                          />
                          {doneFetchingSetSizes &&
                            !get(setSizes, setId) &&
                            <Tooltip Component="Set is either empty or deprecated.">
                              <ExclamationTriangleIcon
                                style={{ paddingLeft: '5px', color: '#8a6d3b' }}
                              />
                            </Tooltip>}
                        </Td>
                        <Td
                          key={`setType${i}`}
                          style={{
                            width: '100px',
                            textTransform: 'capitalize',
                          }}
                        >
                          {setType}
                        </Td>
                        <Td
                          key={`setName${i}`}
                          style={{
                            width: '50%',
                          }}
                        >
                          <EditableLabel
                            text={setName}
                            handleSave={value =>
                              dispatch(
                                updateSet({
                                  type: setType,
                                  label: value,
                                  id: setId,
                                }),
                              )}
                          />
                        </Td>
                        <Td key={`count${i}`}>
                          {get(setSizes, setId) > 0
                            ? <ExploreLink
                                query={{
                                  searchTableTab: `${setType}s`,
                                  filters: linkFilters,
                                }}
                              >
                                {countComponent}
                              </ExploreLink>
                            : <span>{countComponent}</span>}
                        </Td>
                        <Td>
                          {doneFetchingSetSizes &&
                            get(setSizes, setId) > 0 &&
                            <Row>
                              <DownloadButton
                                className="test-download-set-tsv"
                                style={{
                                  ...visualizingButton,
                                  marginLeft: '5px',
                                }}
                                endpoint={`${setType}s`}
                                activeText="TSV"
                                inactiveText="TSV"
                                altMessage={false}
                                setParentState={() => {}}
                                active={false}
                                filters={filters}
                                extraParams={{ format: 'tsv' }}
                                fields={downloadFields[setType]}
                                filename={`set-${setName}-ids`}
                              />
                              {setType === 'case' &&
                                <ButtonLikeRepoLink
                                  query={{
                                    searchTableTab: 'files',
                                    filters: linkFilters,
                                  }}
                                >
                                  View Files in Repository
                                </ButtonLikeRepoLink>}
                            </Row>}
                        </Td>
                      </Tr>,
                  )}
                </tbody>
              }
            />
          </Column>}
    </Column>
  );
};

export default enhance(ManageSetsPage);
