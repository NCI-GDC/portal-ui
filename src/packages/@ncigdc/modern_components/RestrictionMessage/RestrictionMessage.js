import React from 'react';

const styles = {
  faLeftAlign: {
    display: 'inline-block',
    marginRight: 5,
  },
  icon: {
    height: 34,
  },
  list: {
    listStyleType: 'none',
    paddingBottom: 10,
    paddingLeft: 30,
    width: '100%',
  },
  listCompact: {
    paddingBottom: 0,
  },
  listItem: {
    fontSize: 14,
    lineHeight: '24px',
    marginTop: 10,
    paddingBottom: 5,
    position: 'relative',
    textAlign: 'left',
  },
  listItemArrow: {
    color: '#ccc',
    left: -20,
    lineHeight: '24px',
    position: 'absolute',
    top: 0,
  },
  title: {
    color: '#085181',
    fontSize: '18px',
    fontWeight: 500,
    lineHeight: 1.333,
    marginTop: 10,
  },
  titleLeftAlign: {
    paddingLeft: 10,
    textAlign: 'left',
  },
  wrapper: {
    border: '1px solid rgba(38, 120, 178, 0.27)',
    borderRadius: 5,
    flexGrow: 1,
    margin: 14,
    maxWidth: 450,
    padding: '20px 20px 0',
    textAlign: 'center',
    width: 'calc(50% - 28px)',
  },
  wrapperCompact: {
    marginBottom: 0,
    padding: '5px 5px 0',
  },
  wrapperFullWidth: {
    marginLeft: 0,
    marginRight: 0,
    maxWidth: '100%',
    width: '100%',
  },
};

const RestrictionMessage = ({
  children,
  // children need to be span elements
  compact = false,
  faClass = '',
  faStyle = {},
  fullWidth = false,
  icon,
  leftAlign = false,
  title,
}) => (
  <div
    style={{
      ...styles.wrapper,
      ...fullWidth && styles.wrapperFullWidth,
      ...compact && styles.wrapperCompact,
    }}
    >
    {faClass
      ? leftAlign || (
        <i
          className={`fa ${faClass}`}
          style={{
            ...faStyle,
          }}
          />
      )
      : (
        <img
          alt=""
          src={icon}
          style={styles.icon}
          />
      )}
    <h3
      style={{
        ...styles.title,
        ...leftAlign && styles.titleLeftAlign,
      }}
      >
      {leftAlign && (
        <i
          className={`fa ${faClass}`}
          style={{
            ...styles.faLeftAlign,
            ...faStyle,
          }}
          />
      )}
      {title}
    </h3>
    {children && (
      <ul
        style={{
          ...styles.list,
          ...compact && styles.listCompact,
        }}
        >
        {[].concat(children).map((child, i) => (
          <li
            key={i}
            style={styles.listItem}
            >
            <i
              aria-hidden="true"
              className="fa fa-arrow-right"
              style={styles.listItemArrow}
              />
            {child}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default RestrictionMessage;
