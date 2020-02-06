import React from 'react';

const RestrictionMessage = ({
  children,
  icon,
  title,
}) => {
  // children need to be React.Fragment
  const childrenArray = [].concat(children);
  return (
    <div
      style={{
        border: '1px solid rgba(38, 120, 178, 0.27)',
        borderRadius: '5px',
        flexGrow: 1,
        margin: '0 10px',
        maxWidth: '450px',
        padding: '20px 20px 0',
        textAlign: 'center',
        width: 'calc(50% - 20px)',
      }}
      >
      <img
        alt=""
        src={icon}
        style={{
          height: 34,
        }}
        />
      <h3
        style={{
          color: '#085181',
          fontSize: '18px',
          lineHeight: '24px',
          marginTop: 10,
        }}
        >
        {title}
      </h3>
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

export default RestrictionMessage;
