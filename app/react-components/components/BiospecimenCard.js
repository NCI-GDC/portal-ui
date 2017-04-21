import React from 'react';
import _ from 'lodash';
import SearchIcon from 'react-icons/lib/fa/search';
import { withState } from 'recompose';
import { search, idFields, formatValue } from '../utils/biotree';
import Card from '../uikit/Card';
import Button from '../Button';
import { Row, Column } from '../uikit/Flex';
import { Input } from '../uikit/Form';
import EntityPageVerticalTable from './EntityPageVerticalTable';
import BioTreeView from './BioTreeView';
import theme from '../theme';

let styles = {
  cardHeader: {
    padding: '1rem',
    color: theme.greyScale7,
  },
  button: {
    color: '#333',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    minWidth: '115px',
    minHeight: '34px',
    display: 'inline-flex',
    outline: 'none',
  },
  searchIcon: {
    backgroundColor: theme.greyScale5,
    color: theme.greyScale2,
    padding: '0.8rem',
    width: '3.4rem',
    height: '3.4rem',
    borderRadius: '4px 0 0 4px',
    border: `1px solid ${theme.greyScale4}`,
    borderRight: 'none',
  },
};

let BiospecimenCard = ({ p, state: { selectedEntity: se, type, query }, setState }) => {
  let selectedEntity =
    (query && (_.flatten(p.samples.map(e => search(query, e))) || [])[0]) || se;

  return (
    <Card title="Biospecimen" headerStyle={styles.cardHeader} style={{ flex: 1 }}>
      <Row>
        <Column flex="3" style={{ padding: '0 15px' }}>
          <Row spacing="30px">
            <Row flex="1">
              <SearchIcon style={styles.searchIcon} />
              <Input
                onChange={({ target }) => setState(s => ({ ...s, query: target.value }))}
                placeholder="Search"
              />
            </Row>
          </Row>

          <Column style={{ padding: '10px' }}>
            <BioTreeView
              entities={p.samples}
              type={{ s: 'sample', p: 'samples' }}
              query={query}
              selectedEntity={selectedEntity}
              selectEntity={selectedEntity => setState(s => ({ ...s, selectedEntity }))}
              defaultExpanded
            />
          </Column>

        </Column>
        <Column flex="4">
          <EntityPageVerticalTable
            thToTd={[
              { th: 'Submitter ID', td: selectedEntity.submitter_id },
              { th: type, td: selectedEntity[idFields.find(id => selectedEntity[id])] },
              ...Object.entries(selectedEntity)
                .filter(([key]) =>
                  key !== 'submitter_id' && key !== 'expanded' && key !== type + '_id'
                )
                .map(([key, val]) => ({
                  th: key, td: formatValue(val),
                })),
            ]}
            style={{ flex: 1 }}
          />
        </Column>
      </Row>
    </Card>
  );
};

export default withState(
  'state',
  'setState',
  ({ p }) => ({
    selectedEntity: p.samples[0],
    type: 'sample',
    query: '',
  })
)(BiospecimenCard);
