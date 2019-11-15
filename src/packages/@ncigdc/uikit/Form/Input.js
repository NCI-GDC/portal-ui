// @flow

import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@ncigdc/theme/icons/CloseIcon';

const styles = {
  container: {
    position: 'relative',
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
    color: '#555555',
    fontSize: '14px',
    height: '34px',
    lineHeight: '1.42857143',
    minWidth: 0,
    padding: '6px 12px',
    transition: 'border-color ease-in-out .15s, box-shadow ease-in-out .15s',
    width: '100%',
  },
};

const Input = ({
  getNode = null,
  handleClear = null,
  onKeyDown = null,
  style,
  value = '',
  ...props
}) => (
  <div
    className="input-container"
    style={styles.container}
    >
    <input
      aria-label="text"
      onKeyDown={e => {
        e.stopPropagation();
        handleClear && value &&
          (e.key === 'Escape' || e.keyCode === 27) &&
          handleClear();

        onKeyDown && onKeyDown(e);
      }}
      ref={getNode}
      style={{
        ...styles.input,
        ...style,
      }}
      type="text"
      value={value}
      {...props}
      />

    {handleClear && value && (
      <CloseIcon
        onClick={handleClear}
        style={{
          cursor: 'pointer',
          fontSize: '14px',
          outline: 0,
          padding: '10px',
          position: 'absolute',
          right: 0,
          transition: 'all 0.3s ease',
        }}
        />
    )}
  </div>
);

Input.propTypes = {
  getNode: PropTypes.func,
  handleClear: PropTypes.func,
  onChange: PropTypes.func,
  style: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

/*----------------------------------------------------------------------------*/

export default Input;
