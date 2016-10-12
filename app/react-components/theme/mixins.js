export const center = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const zDepth1 = {
  boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
};

export const buttonLike = {
  ...center,
  padding: '6px 12px',
  fontSize: '14px',
  borderRadius: '4px',
  border: '1px solid transparent',
};

export const dropdown = {
  ...zDepth1,
  position: 'absolute',
  zIndex: 1,
  minWidth: '165px',
  backgroundColor: 'white',
  textAlign: 'left',
  marginTop: '1rem',
  right: 0,
};

export const margin = (left, right) => {
  if (left && right) {
    return { margin: '0 0.5rem' };
  } else if (left) {
    return { marginLeft: '0.5rem' };
  } else if (right) {
    return { marginRight: '0.5rem' };
  }
  return {};
};
