// @flow

// Vendor
import React from 'react';
import { Link } from 'react-router';
import AnnotationIcon from 'react-icons/lib/fa/align-left';
import FileIcon from 'react-icons/lib/fa/file-text';
import Color from 'color';
import { css } from 'glamor';
import ShoppingCartIcon from '@ncigdc/theme/icons/ShoppingCart';

// Custom
import { Row } from '@ncigdc/uikit/Flex';
import { withTheme } from '@ncigdc/theme';
import { center } from '@ncigdc/theme/mixins';
import CartLink from '@ncigdc/components/Links/CartLink';
import LoginButton from '@ncigdc/components/LoginButton';

/*----------------------------------------------------------------------------*/

const styles = {
  nav: theme => ({
    backgroundColor: theme.greyScale2,
    height: '36px',
    justifyContent: 'center',
    zIndex: 2000,
  }),
  link: theme => css({
    color: 'white !important',
    padding: '10px 13px',
    textDecoration: 'none !important',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: Color(theme.greyScale2)
        .darken(0.5)
        .rgbString(),
    },
    ...center,
  }),
  faded: {
    color: 'rgb(191, 191, 191)',
  },
  marginLeft: {
    marginLeft: '0.7rem',
  },
  fileLength: {
    marginLeft: '0.5rem',
    padding: '0.4rem 0.6rem',
    fontSize: '1rem',
    backgroundColor: '#5b5151',
  },
};

const Nav = ({ theme }) => (
  <Row style={styles.nav(theme)}>
    <Row flex="1" />
    <Row flex="1">
      <Link className={`${styles.link(theme)}`} to="/files">
        <FileIcon style={styles.faded} />
        <span style={styles.marginLeft}>Files</span>
      </Link>
      <Link className={`${styles.link(theme)}`} to="/annotations">
        <AnnotationIcon style={styles.faded} />
        <span style={styles.marginLeft}>Annotations</span>
      </Link>
    </Row>
    <Row>
      <LoginButton />
      <CartLink className={`${styles.link(theme)}`}>
        {count => (
          <span>
            <ShoppingCartIcon style={styles.faded} />
            <span style={{ marginLeft: '0.7rem' }}>Cart</span>
            <span style={styles.fileLength}>{count}</span>
          </span>
        )}
      </CartLink>
    </Row>
  </Row>
);

/*----------------------------------------------------------------------------*/

export default withTheme(Nav);
