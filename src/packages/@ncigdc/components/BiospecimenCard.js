// @flow

import React from 'react';
import _ from 'lodash';
import SearchIcon from 'react-icons/lib/fa/search';
import { compose, withState } from 'recompose';

import { humanify } from '@ncigdc/utils/string';
import { search, idFields, formatValue } from '@ncigdc/utils/biotree';
import { makeFilter } from '@ncigdc/utils/filters';

import Card from '@ncigdc/uikit/Card';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Input from '@ncigdc/uikit/Form/Input';

import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import Hidden from '@ncigdc/components/Hidden';
import BioTreeView from '@ncigdc/components/BioTreeView';
import DownloadButton from '@ncigdc/components/DownloadButton';

import { withTheme } from '@ncigdc/theme';
import { visualizingButton } from '@ncigdc/theme/mixins';
import Button from '@ncigdc/uikit/Button';
import Emitter from '@ncigdc/utils/emitter';

const styles = {
  button: {
    color: '#333',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    minWidth: '115px',
    minHeight: '34px',
    display: 'inline-flex',
    outline: 'none',
  },
  searchIcon: theme => ({
    backgroundColor: theme.greyScale5,
    color: theme.greyScale2,
    padding: '0.8rem',
    width: '3.4rem',
    height: '3.4rem',
    borderRadius: '4px 0 0 4px',
    border: `1px solid ${theme.greyScale4}`,
    borderRight: 'none',
  }),
};

type TProps = {
  p: Object,
  state: Object,
  setState: Function,
  theme: Object,
  setAllExpanded: Function,
  allExpanded: Boolean,
  expandAllFirstClick: Boolean,
  setExpandAllFirstClick: Function,
};

const BiospecimenCard = ({
  p,
  state: { selectedEntity: se, type, query },
  setState,
  theme,
  setAllExpanded,
  allExpanded,
  expandAllFirstClick,
  setExpandAllFirstClick,
}: TProps) => {
  const founds = p.samples.hits.edges.map(e => search(query, e));
  const flattened = _.flatten(founds);
  const foundNode = ((flattened || [])[0] || { node: {} }).node;
  const selectedNode = (query && foundNode) || se;
  const selectedEntity = Object.keys(selectedNode).length
    ? selectedNode
    : p.samples.hits.edges[0].node;

  return (
    <Card
      className="test-biospecimen-card"
      style={{ flex: 1 }}
      title={
        <Row style={{ justifyContent: 'space-between' }}>
          <span>Biospecimen</span>
          <DownloadButton
            className="test-download-biospecimen"
            style={visualizingButton}
            filename={`biospecimen.case-${p.case_id}`}
            endpoint="cases"
            activeText="Processing"
            inactiveText="Export"
            filters={makeFilter([{ field: 'cases.case_id', value: p.case_id }])}
            fields={['case_id']}
            dataExportExpands={[
              'samples',
              'samples.portions',
              'samples.portions.analytes',
              'samples.portions.analytes.aliquots',
              'samples.portions.analytes.aliquots.annotations',
              'samples.portions.analytes.annotations',
              'samples.portions.submitter_id',
              'samples.portions.slides',
              'samples.portions.annotations',
              'samples.portions.center',
            ]}
          />
        </Row>
      }
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
                onChange={({ target }) =>
                  setState(s => ({ ...s, query: target.value }))}
                placeholder="Search"
                value={query}
                style={{ borderRadius: '0 4px 4px 0' }}
              />
            </Row>
            <Button
              style={{
                paddingLeft: '10px',
              }}
              onClick={() => {
                Emitter.emit('expand', !allExpanded);
                setExpandAllFirstClick(false);
                setAllExpanded(!allExpanded);
              }}
            >
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </Button>
          </Row>

          <Column style={{ padding: '10px' }}>
            <BioTreeView
              entities={{ ...p.samples, expanded: expandAllFirstClick }}
              type={{ s: 'sample', p: 'samples' }}
              query={query}
              selectedEntity={selectedEntity}
              selectEntity={(selectedEntity, type) =>
                setState(s => ({
                  ...s,
                  selectedEntity,
                  type: type.s,
                  query: '',
                }))}
              defaultExpanded={allExpanded}
            />
          </Column>

        </Column>
        <Column flex="4">
          <EntityPageVerticalTable
            thToTd={[
              { th: `${type} ID`, td: selectedEntity.submitter_id },
              {
                th: `${type} UUID`,
                td: selectedEntity[idFields.find(id => selectedEntity[id])],
              },
              ...Object.entries(selectedEntity)
                .filter(
                  ([key]) =>
                    ![
                      'submitter_id',
                      'expanded',
                      `${type}_id`,
                      '__dataID__',
                    ].includes(key),
                )
                .map(([key, val]) => {
                  if (
                    ['portions', 'aliquots', 'analytes', 'slides'].includes(key)
                  ) {
                    return {
                      th: humanify({ term: key }),
                      td: formatValue(val.hits.total),
                    };
                  }
                  return { th: humanify({ term: key }), td: formatValue(val) };
                }),
            ]}
            style={{ flex: '1 1 auto' }}
          />
        </Column>
      </Row>
    </Card>
  );
};

export default compose(
  withState('allExpanded', 'setAllExpanded', false),
  withState('expandAllFirstClick', 'setExpandAllFirstClick', true),
  withState('state', 'setState', ({ p, bioId }) => ({
    selectedEntity: p.samples.hits.edges[0].node,
    type: 'sample',
    query: bioId || '',
  })),
  withTheme,
)(BiospecimenCard);
