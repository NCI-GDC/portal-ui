// Vendor
import React from 'react';

// Custom
import Column from '../uikit/Flex/Column';
import Row from '../uikit/Flex/Row';

let styles = {
  nav: {
    boxShadow: `0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)`,
    width: '220px',
    marginTop: '-20px',
    paddingTop: '20px',
    backgroundColor: 'rgb(232, 232, 232)',
    position: 'fixed',
    height: '100vh',
    zIndex: 100,
  },
  linkContainer: {
    padding: `10px 0 10px 20px`,
    fontSize: `1em`,
    alignItems: `center`,
  },
  link: {
    textDecoration: 'none',
    color: '#1f486c',
  },
  body: {
    width: '100%',
    padding: '0 100px 50px 270px',
  },
}

let getOffset = elem => {
    let box = elem.getBoundingClientRect();

    let body = document.body;
    let docEl = document.documentElement;

    let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    let clientTop = docEl.clientTop || body.clientTop || 0;

    let top = box.top + scrollTop - clientTop;

    return Math.round(top);
}

let jump = id => {
  window.location.hash = id;
  setTimeout(() => {
    window.scrollTo(
      0,
      getOffset(document.getElementById(id)) - 120
    );
  }, 10);
};

const SideNavLayout = props => {
  return (
    <Row>
      <Column style={styles.nav}>
        {props.links.map(x =>
          <Row onClick={() => jump(x.id)} key={x.title} style={styles.linkContainer} className="side-nav-link">
            <a style={styles.link}>
              <i className={`fa fa-${x.icon}`} style={{ paddingRight: `10px` }} />
              {x.title}
            </a>
          </Row>
        )}
      </Column>
      <Column style={styles.body}>
        {props.children}
      </Column>
    </Row>
  );
};

export default SideNavLayout;
