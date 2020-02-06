import React from 'react';
// import styled from 'styled-components';

const CaseLimitMessage = ({
  children,
  icon,
  title,
}) => {
  // children need to be React.Fragment
  const childrenArray = [].concat(children);
  return (
    <div>
      <p>{icon}</p>
      <p>{title}</p>
      {children && (
        <ul>
          {childrenArray.map((child, i) => (
            <li key={i}>{child}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CaseLimitMessage;
