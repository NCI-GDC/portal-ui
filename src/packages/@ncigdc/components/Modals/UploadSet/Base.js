// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';

import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { setModal } from '@ncigdc/dux/modal';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';

import SetInput from './SetInput';

const styles = {
  horizontalPadding: {
    paddingRight: 20,
    paddingLeft: 20,
  },
};

const enhance = compose(
  connect(),
  withState('validating', 'setValidating', false),
  withState('hits', 'setHits', []),
  withPropsOnChange(
    ['hits', 'validating'],
    ({ hits, setValidating, validating, validateHits, idMap }) => {
      if (!validating) {
        validateHits(hits, setValidating);
      }

      return {
        matched: hits.filter(g => idMap[g]),
        unmatched: hits.filter(g => idMap[g] === null),
      };
    },
  ),
);

class UploadSet extends React.Component {
  input = null;
  clear = () => {
    this.input && this.input.clear();
  };
  render() {
    const {
      hits,
      setHits,
      unmatched,
      matched,
      validating,
      CreateSetButton,
      dispatch,
      inputProps,
      MappingTable,
      heading,
      validatingMessage,
    } = this.props;

    return (
      <div>
        <h2
          style={{
            ...styles.horizontalPadding,
            margin: 0,
            paddingBottom: 10,
            paddingTop: 15,
          }}
        >
          {heading}
        </h2>
        <div
          style={{
            ...styles.horizontalPadding,
            borderTop: '1px solid #e5e5e5',
            borderBottom: '1px solid #e5e5e5',
            paddingTop: 10,
            paddingBottom: 10,
            overflow: 'auto',
            // calc instead of using flex because IE11 doesn't handle flex + max-height properly
            maxHeight: 'calc(100vh - 160px)',
          }}
        >
          <SetInput
            {...inputProps}
            onUpdate={setHits}
            ref={n => (this.input = n)}
          />
          {validating && validatingMessage}
          <MappingTable matched={matched} unmatched={unmatched} />
        </div>
        <Row
          style={{
            ...styles.horizontalPadding,
            justifyContent: 'flex-end',
            paddingTop: 10,
            paddingBottom: 15,
          }}
          spacing="1rem"
        >
          <Button onClick={() => dispatch(setModal(null))}>Cancel</Button>
          <Button onClick={this.clear} disabled={!hits.length}>Clear</Button>

          <CreateSetButton
            hits={matched}
            onClose={() => dispatch(setModal(null))}
          />
        </Row>
      </div>
    );
  }
}

export default enhance(UploadSet);
