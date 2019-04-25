// @flow

import React from 'react';
import { compose, withState } from 'recompose';
import { xor } from 'lodash';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';

const styles = {
  horizonalPadding: {
    paddingRight: 20,
    paddingLeft: 20,
  },
  button: {
    ...visualizingButton,
    minWidth: 100,
  },
};

type TOption = {
  name: string,
};

type TProps = {
  options: Array<TOption>,
  onClose: Function,
  selectedOptions: Array<number>,
  setSelectedOptions: Function,
};

const SelectOverlay = ({
  options = [],
  onClose,
  selectedOptions,
  setSelectedOptions,
}: TProps) => (
  <Column
    style={{
      padding: '15px',
    }}>
    <Row
      style={{
        ...styles.horizonalPadding,
        borderBottom: '1px solid #e5e5e5',
      }}>
      <h2 style={{ marginTop: 0 }}>Select Tracks to Add</h2>
    </Row>
    <div
      style={{
        ...styles.horizonalPadding,
        paddingTop: 10,
      }}>
      {options.map((track, i) => (
        <Row key={track.name} style={{ alignItems: 'center' }}>
          <input
            checked={selectedOptions.indexOf(i) >= 0}
            id={track.name}
            name={track.name}
            onChange={() => setSelectedOptions(xor(selectedOptions, [i]))}
            type="checkbox"
            value={i} />
          <label htmlFor={track.name} style={{ marginLeft: 5 }}>
            {track.name}
          </label>
        </Row>
      ))}
      <Row
        spacing="1rem"
        style={{
          justifyContent: 'center',
          marginTop: 10,
        }}>
        <Button
          onClick={() => onClose(selectedOptions.map(i => options[i]))}
          style={styles.button}>
          Add Tracks
        </Button>
        <Button onClick={() => onClose()} style={styles.button}>
          Cancel
        </Button>
      </Row>
    </div>
  </Column>
);

const enhance = compose(withState('selectedOptions', 'setSelectedOptions', []));

export default enhance(SelectOverlay);
