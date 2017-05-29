// @flow

import React from 'react';

import { Row, Column } from '@ncigdc/uikit/Flex';
import { withTheme } from '@ncigdc/theme';
import { scrollToId } from '@ncigdc/utils/deepLink';

const styles = {
  nav: theme => ({
    width: '200px',
    marginTop: '-12px',
    paddingTop: '80px',
    backgroundColor: 'rgb(232, 232, 232)',
    position: theme.headerPosition,
    height: theme.headerPosition === 'fixed' ? '100vh' : 'calc(100% + 200px)',
    zIndex: 50,
  }),
  linkContainer: {
    padding: '10px 0 10px 20px',
    alignItems: 'center',
  },
  link: theme => ({
    textDecoration: 'none',
    color: theme.primary,
    fontSize: '0.9em',
    alignItems: 'center',
  }),
  title: theme => ({
    background: 'rgba(255, 255, 255, 0.9)',
    color: theme.primary,
    padding: '14px 0 8px 270px',
    width: '100%',
    position: theme.headerPosition,
    zIndex: 55,
    boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
    fontSize: '2.2rem',
  }),
  type: theme => ({
    backgroundColor: theme.primary,
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
  }),
  body: {
    width: '100%',
    padding: '85px 100px 70px 270px',
  },
};


const SideNavLayout = props => (
  <Row>
    <Column style={styles.nav(props.theme)}>
      {props.links.map(x =>
        <Row onClick={() => scrollToId(x.id)} key={x.title} style={styles.linkContainer} className="side-nav-link">
          <a style={styles.link(props.theme)}>
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
      <Row style={styles.title(props.theme)}>
        <span style={styles.type(props.theme)}>{props.entityType}</span>
        {props.title}
      </Row>
      <Column style={styles.body}>
        {props.children}
      </Column>
    </Column>
  </Row>
);

export default withTheme(SideNavLayout);
