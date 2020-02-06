import React from 'react';

const styles = {
  icon: {
    height: 34,
  },
  list: {
    listStyleType: 'none',
    paddingBottom: 10,
    paddingLeft: 30,
    width: '100%',
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
};

const RestrictionMessage = ({
  children,
  // children need to be React.Fragment
  icon,
  title,
}) => (
  <div
    style={styles.wrapper}
    >
    <img
      alt=""
      src={icon}
      style={styles.icon}
      />
    <h3
      style={styles.title}
      >
      {title}
    </h3>
    {children && (
      <ul
        style={styles.list}
        >
        {[].concat(children).map((child, i) => (
          <li
            key={i}
            style={styles.listItem}
            >
            <i
              ariaHidden="true"
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
