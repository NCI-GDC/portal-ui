import React from 'react';
import Markdown from 'react-markdown';
import {
  compose,
  pure,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';

import Row from '@ncigdc/uikit/Flex/Row';
import BannerLink from './BannerLink';
import './styles.scss';

const levelToIcon = {
  error: <span className="fa fa-exclamation-triangle icon" />,
  info: <span className="fa fa-question icon" />,
  warning: <span className="fa fa-exclamation icon" />,
};

type BannerProps = {
  dismissed: boolean,
  dismissible: boolean,
  handleOnDismiss: () => {},
  isSectionHeader: boolean,
  level: string,
  message: string,
  reactElement: boolean,
};

const Banner = ({
  dismissible,
  handleOnDismiss,
  isSectionHeader,
  level = 'info',
  message,
  reactElement,
  style,
}: BannerProps) => (
  <Row
    className={`header-banner ${
      isSectionHeader
        ? 'sectionHeader'
        : `notification ${level.toLowerCase()}`
    }`}
    style={style}
    >
    {level !== 'none' && levelToIcon[level.toLowerCase()]}

    {message && (
      <span className="message">
        {!reactElement ? (
          <Markdown
            renderers={{
              link: props => <BannerLink level={level} {...props} />,
            }}
            source={message}
            />
        ) : (
          message
        )}
      </span>
    )}

    {dismissible && (
      <span
        className="header-banner-dismiss"
        onClick={handleOnDismiss}
        >
        Dismiss
        {' '}
        <i className="fa fa-times" />
      </span>
    )}
  </Row>
);

const styles = {
  dismissed: {
    borderBottom: 0,
    height: 0,
    lineHeight: 0,
    opacity: 0,
    paddingBottom: 0,
    paddingTop: 0,
  },
  show: {
    height: 'auto',
    lineHeight: 'unset',
    opacity: 1,
  },
};

const verticalPadding = pad => ({
  paddingBottom: `${pad}rem`,
  paddingTop: `${pad}rem`,
});

export default compose(
  setDisplayName('EnhancedBanner'),
  withPropsOnChange(
    ({
      dismissed,
      message,
    }, {
      dismissed: nextDismissed,
      message: nextMessage,
    }) => !(
      dismissed === nextDismissed &&
      message === nextMessage
    ),
    ({
      dismissed,
      isSectionHeader,
      message,
    }) => ({
      style: {
        ...(dismissed || !message
          ? styles.dismissed
          : {
            ...styles.show,
            ...verticalPadding(isSectionHeader ? '0.5' : '1'),
            color: `${isSectionHeader ? '#3a3a3a' : '#fff'}`,
          }),
      },
    }),
  ),
  pure,
)(Banner);
