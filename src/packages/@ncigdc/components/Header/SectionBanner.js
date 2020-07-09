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
import withControlledAccess from '@ncigdc/utils/withControlledAccess';

const SectionHeader = ({ message }) => (
  <Banner
    bannerType="sectionHeader"
    isSectionHeader
    level="none"
    message={message}
    />
);

const sectionTitles = {
  '/exploration': controlled => `Explore${controlled ? ' Controlled & ' : ' '}Open Data`,
};

export default compose(
  setDisplayName('EnhancedSectionHeader'),
  withControlledAccess,
  withRouter,
  withPropsOnChange(
    ({
      controlledAccessProps: {
        controlledStudies,
      } = {},
      location: {
        pathname,
        state,
      },
    }, {
      controlledAccessProps: {
        controlledStudies: nextControlledStudies,
      } = {},
      location: {
        pathname: nextPathname,
        state: nextState,
      },
    }) => !(
      isEqual(controlledStudies, nextControlledStudies) &&
      pathname === nextPathname &&
      isEqual(state, nextState)
    ),
    ({
      controlledAccessProps: {
        controlledStudies = [],
      } = {},
      location: {
        pathname,
        state: {
          sectionBannerTitle,
        } = {},
      },
    }) => ({ // "message" can be a React component
      message: sectionBannerTitle ||
        (sectionTitles[pathname] && sectionTitles[pathname](controlledStudies.length)),
    }),
  ),
  pure,
)(SectionHeader);
