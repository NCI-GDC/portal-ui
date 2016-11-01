import React from 'react';
import { compose, withState } from 'recompose';

import Row from '../uikit/Flex/Row';
import Column from '../uikit/Flex/Column';
import Overlay from'../uikit/Overlay';

const styles = {
  container: {
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
    background: '#fff',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRadius: 6,
    padding: 20,
    pointerEvents: 'all',
  }
};

const SelectOverlay = ({options = [], callback, selectedOptions, setSelectedOptions, show = true}) => (
  <Overlay show={show}>
    <Column style={styles.container}>
      {
        options.map((track, i) => (
          <Row key={track.name}>
            <input
              value={i}
              type="checkbox"
              name={track.name}
              id={track.name}
              checked={selectedOptions.indexOf(i) >= 0}
              onChange={() => {
                const index = selectedOptions.indexOf(i);

                if(index >= 0) {
                  selectedOptions.splice(index, 1);
                  setSelectedOptions(selectedOptions);
                } else {
                  setSelectedOptions([ ...selectedOptions, i ]);
                }
              }}
            />
            <label htmlFor={track.name} style={{ marginLeft: 5 }}>{track.name}</label>
          </Row>
        ))
      }
      <Row>
        <button onClick={() => callback(selectedOptions.map((i) => options[i]))} >Add Tracks</button>
        <button onClick={() => callback([])}>Cancel</button>
      </Row>
    </Column>
  </Overlay>
);

const enhance = compose(
  withState('selectedOptions', 'setSelectedOptions', [])
);

export default enhance(SelectOverlay);