import React, { PropTypes } from 'react';

/*----------------------------------------------------------------------------*/

const styles = {
  input: {
    width: '100%',
    height: '34px',
    padding: '6px 12px',
    fontSize: '14px',
    lineHeight: '1.42857143',
    color: '#555555',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
    transition: 'border-color ease-in-out .15s, box-shadow ease-in-out .15s',
  },
};

const Input = ({ style, getNode, ...props }) => (
  <input
    type="text" 
    ref={getNode || (() => {})}
    style={{ ...styles.input, ...(style || {}) }}
    {...props}
  />
);

Input.propTypes = {
  style: PropTypes.object,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

/*----------------------------------------------------------------------------*/

export default Input;
