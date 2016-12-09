// Vendor
import React from 'react';

// Custom
import Column from '../uikit/Flex/Column';
import Row from '../uikit/Flex/Row';

const styles = {
  nav: {
    width: '200px',
    marginTop: '-12px',
    paddingTop: '80px',
    backgroundColor: 'rgb(232, 232, 232)',
    position: 'fixed',
    height: '100vh',
    zIndex: 50,
  },
  linkContainer: {
    padding: '10px 0 10px 20px',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#1f486c',
    fontSize: '0.9em',
    alignItems: 'center',
  },
  title: {
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#265986',
    padding: '14px 0 8px 270px',
    width: '100%',
    position: 'fixed',
    zIndex: 55,
    boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
    fontSize: '2.2rem',
  },
  type: {
    backgroundColor: '#265986',
    borderRadius: '100px',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: 'white',
    marginRight: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    transform: 'scale(0.85)',
  },
  body: {
    width: '100%',
    padding: '85px 100px 50px 270px',
  },
};

const getOffset = elem => {
  const box = elem.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const clientTop = docEl.clientTop || body.clientTop || 0;

  const top = box.top + scrollTop - clientTop;

  return Math.round(top);
};

const jump = id => {
  window.location.hash = id;
  setTimeout(() => {
    window.scrollTo(
      0,
      getOffset(document.getElementById(id)) - 160
    );
  }, 10);
};

const SideNavLayout = props => (
  <Row>
    <Column style={styles.nav}>
      {props.links.map(x =>
        <Row onClick={() => jump(x.id)} key={x.title} style={styles.linkContainer} className="side-nav-link">
          <a style={styles.link}>
            {typeof x.icon === 'string'
                ? <i className={`fa fa-${x.icon}`} />
                : x.icon
              }
            <span style={{ marginLeft: '1rem' }}>{x.title}</span>
          </a>
        </Row>
        )}
    </Column>
    <Column flex="1">
      <Row style={styles.title}>
        <span style={styles.type}>{props.entityType}</span>
        {props.title}
      </Row>
      <Column style={styles.body}>
        {props.children}
      </Column>
    </Column>
  </Row>
  );

export default SideNavLayout;
