// @flow
import React from 'react';
import { compose, withState, withPropsOnChange } from 'recompose';
import { debounce } from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import UnstyledButton from '@ncigdc/uikit/UnstyledButton';
import { validateGenes, geneMap } from '@ncigdc/utils/validateIds';
import { CaretIcon, SpinnerIcon } from '@ncigdc/theme/icons';

import MappingTable from './MappingTable';
import CreateSetButton from './CreateSetButton';
import GeneInput from './GeneInput';

const debounceValidateGenes = debounce(validateGenes, 200);

const styles = {
  horizontalPadding: {
    paddingRight: 20,
    paddingLeft: 20,
  },
};

const enhance = compose(
  withState('validating', 'setValidating', false),
  withState('showTable', 'setShowTable', true),
  withState('genes', 'setGenes', []),
  withPropsOnChange(
    ['genes', 'validating'],
    ({ genes, setValidating, validating }) => {
      if (!validating) {
        debounceValidateGenes(genes, setValidating);
      }

      return {
        matched: genes.filter(g => geneMap[g]),
        unmatched: genes.filter(g => geneMap[g] === null),
      };
    },
  ),
);

class UploadGeneSet extends React.Component {
  geneInput = null;
  clear = () => {
    this.geneInput && this.geneInput.clear();
  };
  render() {
    const {
      onClose,
      genes,
      setGenes,
      unmatched,
      matched,
      validating,
      showTable,
      setShowTable,
    } = this.props;

    return (
      <Column
        style={{
          padding: '15px 0',
          maxHeight: 'calc(100vh - 60px)',
        }}
      >
        <h2
          style={{
            ...styles.horizontalPadding,
            margin: 0,
            paddingBottom: 10,
          }}
        >
          Upload Gene Set
        </h2>
        <div
          style={{
            ...styles.horizontalPadding,
            borderTop: '1px solid #e5e5e5',
            borderBottom: '1px solid #e5e5e5',
            paddingTop: 10,
            paddingBottom: 10,
            overflow: 'auto',
          }}
        >
          <GeneInput onUpdate={setGenes} ref={n => (this.geneInput = n)} />
          {validating && <span><SpinnerIcon /> validating genes</span>}
          {!!genes.length &&
            <div style={{ marginTop: '2rem' }}>
              <UnstyledButton
                onClick={e => setShowTable(s => !s)}
                style={{ textDecoration: 'underline' }}
              >
                Summary Table ({matched.length} matched, {unmatched.length}{' '}
                unmatched) <CaretIcon direction={showTable ? 'down' : 'left'} />
              </UnstyledButton>
              {showTable &&
                <MappingTable
                  matched={matched}
                  unmatched={unmatched}
                  style={{ marginTop: '0.5rem' }}
                />}
            </div>}
        </div>
        <Row
          style={{
            ...styles.horizontalPadding,
            justifyContent: 'flex-end',
            paddingTop: 10,
            flex: 'none',
          }}
          spacing="1rem"
        >
          <Button onClick={() => onClose()}>Cancel</Button>
          <Button onClick={this.clear} disabled={!genes.length}>Clear</Button>
          <CreateSetButton genes={matched} onClose={onClose} />
        </Row>
      </Column>
    );
  }
}

export default enhance(UploadGeneSet);
