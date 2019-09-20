import React from 'react';
import {
  find,
  flatten,
  isEqual,
  trimEnd,
} from 'lodash';

import SearchIcon from 'react-icons/lib/fa/search';
import {
  branch,
  compose,
  // pure,
  renderComponent,
  setDisplayName,
  withPropsOnChange,
  withReducer,
  withState,
} from 'recompose';
import { connect } from 'react-redux';
import { humanify } from '@ncigdc/utils/string';
import { makeFilter } from '@ncigdc/utils/filters';
import formatFileSize from '@ncigdc/utils/formatFileSize';
import Card from '@ncigdc/uikit/Card';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Input from '@ncigdc/uikit/Form/Input';
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import Hidden from '@ncigdc/components/Hidden';
import { withTheme } from '@ncigdc/theme';
import { visualizingButton, iconButton } from '@ncigdc/theme/mixins';
import Button from '@ncigdc/uikit/Button';
import Emitter from '@ncigdc/utils/emitter';
import ImageViewerLink from '@ncigdc/components/Links/ImageViewerLink';

import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { MicroscopeIcon } from '@ncigdc/theme/icons';
import withRouter from '@ncigdc/utils/withRouter';
import { DISPLAY_SLIDES } from '@ncigdc/utils/constants';
import DownloadBiospecimenDropdown from '@ncigdc/modern_components/DownloadBiospecimenDropdown';
import timestamp from '@ncigdc/utils/timestamp';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import AddToCartButtonSingle from '@ncigdc/components/AddToCartButtonSingle';
import DownloadFile from '@ncigdc/components/DownloadFile';
import { search, idFields, formatValue } from './utils';
import BioTree from './BioTree';
import treeStatusReducer from './reducers';

const styles = {
  common: theme => ({
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
    backgroundColor: 'transparent',
    color: theme.greyScale2,
    justifyContent: 'flex-start',
  }),
  downloadButton: theme => ({
    ...styles.common(theme),
    border: `1px solid ${theme.greyScale4}`,
    padding: '3px 5px',
  }),
  searchIcon: theme => ({
    backgroundColor: theme.greyScale5,
    border: `1px solid ${theme.greyScale4}`,
    borderRadius: '4px 0 0 4px',
    borderRight: 'none',
    color: theme.greyScale2,
    height: '3.4rem',
    padding: '0.8rem',
    width: '3.4rem',
  }),
};

const entityTypes = [
  {
    p: 'samples',
    s: 'sample',
  },
  {
    p: 'portions',
    s: 'portion',
  },
  {
    p: 'aliquots',
    s: 'aliquot',
  },
  {
    p: 'analytes',
    s: 'analyte',
  },
  {
    p: 'slides',
    s: 'slide',
  },
];

const getType = node => (entityTypes.find(type => node[`${type.s}_id`]) || { s: null }).s;

const BiospecimenCard = ({
  allExpanded,
  history,
  push,
  setState,
  setTreeStatus,
  setTreeStatusOverride,
  state: { query, selectedEntity: se, type },
  theme,
  treeStatusOverride,
  viewer: { repository: { cases: { hits: { edges } } } },
}) => {
  const p = edges[0].node;
  const caseFilter = makeFilter([
    {
      field: 'cases.case_id',
      value: [p.case_id],
    },
  ]);

  const founds = p.samples.hits.edges.map(e => search(query, e));
  const flattened = flatten(founds);
  const foundNode = ((flattened || [])[0] || { node: {} }).node;
  const selectedNode = (query && foundNode) || se;
  const foundType = (query && getType(foundNode)) || type;
  const selectedEntity = Object.keys(selectedNode).length
    ? selectedNode
    : p.samples.hits.edges[0].node;

  const {
    files: { hits: { edges: supplementalFiles = [] } },
  } = edges[0].node;
  const withTrimmedSubIds = supplementalFiles.map(({ node }) => ({
    ...node,
    submitter_id: trimEnd(node.submitter_id, '_slide_image'),
  }));
  const selectedSlide = find(withTrimmedSubIds, {
    submitter_id: selectedEntity.submitter_id,
  });

  return (
    <Card
      className="test-biospecimen-card"
      style={{ flex: 1 }}
      title={(
        <Row style={{ justifyContent: 'space-between' }}>
          <span>Biospecimen</span>
          <DownloadBiospecimenDropdown
            buttonStyles={visualizingButton}
            filters={caseFilter}
            inactiveText="Download"
            jsonFilename={`biospecimen.case-${p.submitter_id}-${p.project
              .project_id}.${timestamp()}.json`}
            total={edges.length}
            tsvFilename={`biospecimen.case-${p.submitter_id}-${p.project
              .project_id}.${timestamp()}.tar.gz`}
            />
        </Row>
      )}
      >
      <Row>
        <Column flex="3" style={{ padding: '0 15px' }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Row style={{ width: '70%' }}>
              <label htmlFor="search-biospecimen">
                <SearchIcon style={styles.searchIcon(theme)} />
                <Hidden>Search</Hidden>
              </label>
              <Input
                id="search-biospecimen"
                name="search-biospecimen"
                onChange={({ target }) => {
                  target.value.length === 0 &&
                    treeStatusOverride === 'query matches' &&
                    setTreeStatusOverride();

                  setState(s => ({
                    ...s,
                    query: target.value,
                  }));
                }}
                placeholder="Search"
                style={{ borderRadius: '0 4px 4px 0' }}
                value={query}
                />
            </Row>
            <Button
              disabled={query.length > 0 && treeStatusOverride === 'query matches'}
              onClick={() => {
                Emitter.emit('expand', !allExpanded);
                setTreeStatusOverride(allExpanded ? 'collapsed' : 'expanded');
              }}
              style={{
                paddingLeft: '10px',
              }}
              >
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </Button>
          </Row>

          <Column style={{ padding: '10px' }}>
            <BioTree
              entities={p.samples}
              entityTypes={entityTypes}
              parentNode="root"
              query={query}
              search={search}
              selectedEntity={selectedEntity}
              selectEntity={(selectedEntity, type) => {
                setState(s => ({
                  ...s,
                  query: '',
                  selectedEntity,
                  type: type.s,
                }));
                push({
                  ...history.location,
                  query: {
                    ...history.location.query,
                    bioId: selectedEntity[`${type.s}_id`],
                  },
                });
              }}
              setTreeStatus={setTreeStatus}
              setTreeStatusOverride={setTreeStatusOverride}
              treeStatusOverride={treeStatusOverride}
              type={{
                p: 'samples',
                s: 'sample',
              }}
              />
          </Column>
        </Column>
        <Column flex="4">
          <EntityPageVerticalTable
            style={{ flex: '1 1 auto' }}
            thToTd={[
              {
                td: selectedEntity.submitter_id,
                th: `${foundType} ID`,
              },
              {
                td: selectedEntity[idFields.find(id => selectedEntity[id])],
                th: `${foundType} UUID`,
              },
              ...Object.entries(selectedEntity)
                .filter(([key]) => ![
                  'submitter_id',
                  'expanded',
                  `${foundType}_id`,
                  '__dataID__',
                ].includes(key))
                .map(([key, val]) => ({
                  td: formatValue([
                    'portions',
                    'aliquots',
                    'analytes',
                    'slides',
                  ].includes(key)
                    ? val.hits.total
                    : val),
                  th: humanify({ term: key }),
                })),
              ...(DISPLAY_SLIDES &&
                foundType === 'slide' &&
                !!selectedSlide && [
                {
                  td: (
                    <Row>
                      <Tooltip Component="View Slide Image">
                        <ImageViewerLink
                          isIcon
                          query={{
                            filters: makeFilter([
                              {
                                field: 'cases.case_id',
                                value: p.case_id,
                              },
                            ]),
                            selectedId: selectedSlide.file_id,
                          }}
                          >
                          <MicroscopeIcon
                            aria-label="View slide image"
                            style={{ maxWidth: '20px' }}
                            />
                        </ImageViewerLink>
                      </Tooltip>

                      <Tooltip Component="Add to cart">
                        <AddToCartButtonSingle
                          asIcon
                          file={selectedSlide}
                          style={{
                            ...iconButton,
                            border: 'none',
                            marginLeft: '0.5rem',
                            marginRight: '0.5rem',
                            paddingBottom: '5px',
                            paddingLeft: '2px',
                          }}
                          />
                      </Tooltip>

                      <Tooltip Component="Download">
                        <DownloadFile
                          activeText=""
                          file={selectedSlide}
                          inactiveText=""
                          style={{
                            ...iconButton,
                            marginLeft: '0.5rem',
                          }}
                          />
                      </Tooltip>
                    </Row>
                  ),
                  th: 'Slide Image',
                },
              ]),
            ]}
            />
        </Column>
      </Row>

      {supplementalFiles.length > 0 && (
        <div
          style={{
            borderTop: `1px solid ${theme.greyScale5}`,
            marginTop: '10px',
            padding: '2px 10px 10px 10px',
          }}
          >
          <EntityPageHorizontalTable
            className="biospecimen-supplement-file-table"
            data={supplementalFiles.map((f, i) => ({
              action: (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                  >
                  <span
                    key="add_to_cart"
                    style={{ paddingRight: '10px' }}
                    >
                    <AddToCartButtonSingle
                      file={{
                        ...f.node,
                        projects: [p.projectId],
                      }}
                      />
                  </span>

                  <span style={{ paddingRight: '10px' }}>
                    <DownloadFile
                      activeText=""
                      file={f.node}
                      inactiveText=""
                      style={{
                        ...styles.downloadButton(theme),
                        backgroundColor: 'white',
                      }}
                      />
                  </span>
                </div>
              ),
              data_format: f.node.data_format,
              file_name: (
                <span key="filename">
                  {f.node.access === 'open' && (
                    <i className="fa fa-unlock-alt" />
                  )}
                  {f.node.access === 'controlled' && (
                    <i className="fa fa-lock" />
                  )}
                  {' '}
                  {f.node.file_name}
                </span>
              ),
              file_size: formatFileSize(f.node.file_size),
            }))}
            headings={[
              {
                key: 'file_name',
                title: 'Filename',
              },
              {
                key: 'data_format',
                title: 'Data format',
              },
              {
                key: 'file_size',
                style: { textAlign: 'right' },
                title: 'Size',
              },
              {
                key: 'action',
                title: 'Action',
              },
            ]}
            title="Biospecimen Supplement File"
            titleStyle={{ fontSize: '1em' }}
            />
        </div>
      )}
    </Card>
  );
};

export default compose(
  setDisplayName('EnhancedBiospecimenCard'),
  branch(
    ({ viewer }) => !viewer.repository.cases.hits.edges[0],
    renderComponent(() => <div>No case found.</div>)
  ),
  branch(
    ({ viewer }) => !viewer.repository.cases.hits.edges[0].node.samples.hits.edges.length,
    renderComponent(() => <div>No biospecimen data found.</div>)
  ),
  connect(state => state.cart),
  withState('state', 'setState', ({
    bioId,
    viewer: {
      repository: {
        cases: {
          hits: {
            edges: [
              {
                node: {
                  samples: {
                    hits: {
                      edges: [{ node: selectedEntity }],
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  }) => ({
    query: bioId || '',
    selectedEntity,
    type: getType(selectedEntity),
  })),
  withState('treeStatusOverride', 'setTreeStatusOverride'),
  withReducer('treeStatus', 'setTreeStatus', ...treeStatusReducer),
  withPropsOnChange(
    (
      {
        query,
        treeStatus,
        treeStatusOverride,
      },
      {
        query: nextQuery,
        treeStatus: nextTreeStatus,
        treeStatusOverride: nextTreeStatusOverride,
      }
    ) => !(
      query === nextQuery &&
      isEqual(nextTreeStatus, treeStatus) &&
      nextTreeStatusOverride === treeStatusOverride
    ),
    ({
      setTreeStatus,
      treeStatus: {
        expanded,
        total,
      },
      treeStatusOverride,
    }) => {
      if (total > 0) {
        treeStatusOverride && setTreeStatus({
          payload: {
            expanded: treeStatusOverride === 'expanded' ||
              (treeStatusOverride === 'query matches' && total > 1),
          },
          type: 'OVERRIDE_NODES',
        });

        return ({
          allExpanded: total === expanded,
        });
      }
    }
  ),
  withRouter,
  withTheme,
)(BiospecimenCard);
