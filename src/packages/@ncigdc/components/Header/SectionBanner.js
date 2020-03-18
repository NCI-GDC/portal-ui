import React from 'react';
import { isEqual } from 'lodash';
import {
  compose,
  pure,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';

import Banner from '@ncigdc/uikit/Banner';
import withRouter from '@ncigdc/utils/withRouter';

const SectionHeader = ({ message }) => (
  <Banner
    bannerType="sectionHeader"
    isSectionHeader
    level="none"
    message={message}
    />
);

const sectionTitles = {
  '/exploration': 'Explore Open Data',
};

export default compose(
  setDisplayName('EnhancedSectionHeader'),
  withRouter,
  withPropsOnChange(
    ({
      location: {
        pathname,
        state,
      },
    }, {
      location: {
        pathname: nextPathname,
        state: nextState,
      },
    }) => !(
      pathname === nextPathname &&
      isEqual(state, nextState)
    ),
    ({
      location: {
        pathname,
        state: {
          sectionBannerTitle,
        } = {},
      },
    }) => ({ // "message" can be a React component
      message: sectionBannerTitle || sectionTitles[pathname],
    }),
  ),
  pure,
)(SectionHeader);
