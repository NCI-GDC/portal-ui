// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { groupBy } from 'lodash';

import { Column, Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { setModal } from '@ncigdc/dux/modal';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import { theme } from '@ncigdc/theme/index';

import SetInput from './SetInput';

const styles = {
  horizontalPadding: {
    paddingLeft: 20,
    paddingRight: 20,
  },
};

const enhance = compose(
  connect(),
  withState('validating', 'setValidating', false),
  withState('hits', 'setHits', []),
  withPropsOnChange(
    ['hits', 'validating'],
    ({
      hits, idMap, setValidating, validateHits, validating,
    }) => {
      const { noSpecialCharHits = [], specialCharHits = [] } = groupBy(
        hits,
        id => (/^[a-zA-Z0-9\->:.]*$/.test(id)
            ? 'noSpecialCharHits'
            : 'specialCharHits'),
      );

      if (!validating) {
        validateHits(noSpecialCharHits, setValidating);
      }

      return {
        matched: noSpecialCharHits.filter(g => idMap[g]),
        unmatched: [...noSpecialCharHits.filter(g => idMap[g] === null), ...specialCharHits],
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
      content,
      CreateSetButton,
      dispatch,
      heading,
      hits,
      inputProps,
      MappingTable,
      matched,
      setHits,
      unmatched,
      validating,
      validatingMessage,
    } = this.props;

    return (
      <Column style={{ margin: '0 2rem 2rem' }}>
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
            borderBottom: `1px solid ${theme.greyScale5}`,
            borderTop: `1px solid ${theme.greyScale5}`,
            // calc instead of using flex because IE11 doesn't handle flex + max-height properly
            maxHeight: 'calc(100vh - 160px)',
            overflow: 'auto',
            paddingBottom: 10,
            paddingTop: 10,
          }}
          >
          {content}
          <SetInput
            {...inputProps}
            onUpdate={setHits}
            ref={n => (this.input = n)}
            />
          {validating && validatingMessage}
          <MappingTable matched={matched} unmatched={unmatched} />
        </div>
        <Row
          spacing="1rem"
          style={{
            ...styles.horizontalPadding,
            justifyContent: 'flex-end',
            paddingTop: 10,
          }}
          >
          <Button onClick={() => dispatch(setModal(null))}>Cancel</Button>
          <Button disabled={!hits.length} onClick={this.clear}>
            Clear
          </Button>

          <CreateSetButton
            hits={matched}
            onClose={() => dispatch(setModal(null))}
            />
        </Row>
      </Column>
    );
  }
}

export default enhance(UploadSet);
