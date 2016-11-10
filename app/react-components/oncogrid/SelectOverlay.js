import React from 'react';
import { compose, withState } from 'recompose';

import Row from '../uikit/Flex/Row';
import Column from '../uikit/Flex/Column';
import Overlay from'../uikit/Overlay';
import Button from '../Button';

const styles = {
  container: {
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
    background: '#fff',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRadius: 6,
    padding: '20px 0 10px',
    pointerEvents: 'all',
    minWidth: 320,
  },
  horizonalPadding: {
    paddingRight: 20,
    paddingLeft: 20,
  },
  button: {
    color: '#333',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    minWidth: 46,
    minHeight: 34,
    display: 'inline-flex',
    minWidth: 100,
  },
};

const SelectOverlay = ({options = [], callback, selectedOptions, setSelectedOptions, show = true}) => (
  <Overlay
    show={show}
    onClick={() => callback()}
    onWheel={e => e.preventDefault()}
  >
    <Column
      style={styles.container}
      onClick={e => e.stopPropagation()}
    >
      <Row style={{
        ...styles.horizonalPadding,
        borderBottom: '1px solid #e5e5e5',
      }}>
        <h2 style={{ marginTop: 0 }}>Select tracks to add</h2>
      </Row>
      <div style={{
        ...styles.horizonalPadding,
        paddingTop: 10,
      }}>
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
        <Row style={{ justifyContent: 'center', marginTop: 10 }}>
          <Button
            style={{
              ...styles.button,
              marginRight: 12,
            }}
            onClick={() => callback(selectedOptions.map((i) => options[i]))}
          >Add Tracks</Button>
          <Button
            style={styles.button}
            onClick={() => callback()}
          >Cancel</Button>
        </Row>
      </div>
    </Column>
  </Overlay>
);

const enhance = compose(
  withState('selectedOptions', 'setSelectedOptions', [])
);

export default enhance(SelectOverlay);