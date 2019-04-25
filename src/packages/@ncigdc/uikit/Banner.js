// @flow

import React from 'react';

import Row from '@ncigdc/uikit/Flex/Row';
import Markdown from 'react-markdown';
import './Banner.css';
import { theme } from '@ncigdc/theme';

const style = {
  headerBanner: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#265986',
    color: 'white',
    padding: '1rem',
    transition: 'all 0.25s ease',
    borderBottom: '1px solid #ebebeb',
  },
  icon: {
    flex: 1,
    paddingLeft: '5px',
    fontSize: '1.2em',
  },
  message: {
    flex: 32,
  },
  dismiss: {
    paddingRight: '5px',
    cursor: 'pointer',
  },
  dismissed: {
    height: '0px',
    overflow: 'hidden',
    padding: 0,
    borderBottom: 0,
  },
  warning: {
    color: '#000',
    fontWeight: 'bold',
    backgroundColor: '#D39C3F',
  },
  error: {
    backgroundColor: '#83001E',
  },
};

const levelToIcon = {
  info: <span className="fa fa-question icon" />,
  warning: <span className="fa fa-exclamation icon" />,
  error: <span className="fa fa-exclamation-triangle icon" />,
};

const BannerLink = ({ level, ...props }) => (
  <a
    className="banner-warning-link"
    href={props.href}
    style={level === 'WARNING' ? { color: theme.primaryHighContrast } : {}}
    target="blank">
    {props.children}
  </a>
);

type BannerProps = {
  message: string,
  level: string,
  dismissible: boolean,
  handleOnDismiss: () => {},
  dismissed: boolean,
  reactElement: boolean,
};

const Banner = ({
  message,
  level,
  dismissible,
  handleOnDismiss,
  dismissed,
  reactElement,
}: BannerProps) => (
  <Row
    className="header-banner"
    style={{
      ...style.headerBanner,
      ...(dismissed ? style.dismissed : {}),
      ...(style[level.toLowerCase()] || {}),
    }}>
    {levelToIcon[level.toLowerCase()] || levelToIcon.info}
    <span style={style.message}>
      {!reactElement ? (
        <Markdown
          renderers={{ link: props => <BannerLink level={level} {...props} /> }}
          source={message} />
      ) : (
        message
      )}
    </span>
    {dismissible && (
      <span
        className="header-banner-dismiss"
        onClick={handleOnDismiss}
        style={style.dismiss}>
        Dismiss
        {' '}
        <i className="fa fa-times" />
      </span>
    )}
  </Row>
);

export default Banner;
