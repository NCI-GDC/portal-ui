import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  isEqual,
  omit,
} from 'lodash';
import {
  compose,
  getContext,
  lifecycle,
  setDisplayName,
  withContext,
  withHandlers,
  withPropsOnChange,
  withState,
} from 'recompose';

import withRouter from '@ncigdc/utils/withRouter';
import { fetchApi } from '@ncigdc/utils/ajax';
import ControlledAccessModal from '@ncigdc/components/Modals/ControlledAccess';
import { setModal } from '@ncigdc/dux/modal';

import {
  DEV_USER,
  DEV_USER_CA,
  DISPLAY_DAVE_CA,
  IS_DEV,
} from '@ncigdc/utils/constants';

import {
  checkUserAccess,
  reshapeSummary,
  reshapeUserAccess,
} from './helpers';

const CONTROLLED_ACCESS_CONTEXT = {
  controlledAccessProps: PropTypes.object,
};
const CONTROLLED_ACCESS_NETWORK = {
  addControlledAccessParams: PropTypes.func,
};

export default getContext(CONTROLLED_ACCESS_CONTEXT);
export const withControlledAccessNetworkLayer = getContext(CONTROLLED_ACCESS_NETWORK);

export const withControlledAccessContext = compose(
  setDisplayName('withControlledAccess'),
  withRouter,
  connect(state => ({
    token: state.auth.token,
    user: state.auth.user,
    userControlledAccess: state.auth.userControlledAccess,
  })),
  withState('studiesSummary', 'setStudiesSummary', {}),
  withHandlers({
    clearUserAccess: ({
      dispatch,
      userControlledAccess = { studies: {} },
    }) => () => {
      Object.keys(userControlledAccess.studies).length > 0 &&
        dispatch({ type: 'gdc/USER_CONTROLLED_ACCESS_CLEAR' });
    },
    fetchStudiesList: ({ setStudiesSummary }) => () => (
      fetchApi(
        '/studies/summary/all',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
        .then(({ data } = {}) => {
          data && setStudiesSummary(reshapeSummary(data));
        })
        .catch(error => console.error(error))
    ),
    storeUserAccess: ({
      dispatch,
    }) => controlled => {
      dispatch({
        payload: reshapeUserAccess(controlled),
        type: 'gdc/USER_CONTROLLED_ACCESS_SUCCESS',
      });
    },
  }),
  lifecycle({
    componentDidMount() {
      const {
        fetchStudiesList,
      } = this.props;

      fetchStudiesList();
    },
  }),
  withPropsOnChange(
    (
      {
        user,
      },
      {
        user: nextUser,
      },
    ) => !(
      isEqual(user, nextUser)
    ),
    ({
      clearUserAccess,
      storeUserAccess,
      user,
      userControlledAccess,
    }) => (user && DISPLAY_DAVE_CA
      ? userControlledAccess.fetched || (
        IS_DEV || DEV_USER
          ? storeUserAccess(DEV_USER_CA)
          : fetchApi('/studies/user')
            .then(({ data }) => {
              storeUserAccess(data.controlled);
            })
            .catch(error => {
              console.error('while fetching user controlled access', error);
              clearUserAccess();
            })
      )
      : clearUserAccess()
    ),
  ),
  withPropsOnChange(
    (
      {
        query: {
          controlled,
        },
        studiesSummary,
        user,
      },
      {
        query: {
          controlled: nextControlled,
        },
        studiesSummary: nextStudiesSummary,
        user: nextUser,
      },
    ) => !(
      controlled === nextControlled &&
      isEqual(studiesSummary, nextStudiesSummary) &&
      isEqual(user, nextUser)
    ),
    ({
      dispatch,
      location: {
        pathname,
      },
      push,
      query,
      query: {
        controlled = '',
      },
      studiesSummary,
      user,
      userControlledAccess,
    }) => {
      // gets the whole array of 'controlled' from the URL
      const controlledQuery = Array.isArray(controlled)
        ? controlled.map(study => study.toLowerCase().split(',')).flat()
        : controlled.toLowerCase().split(',');

      // distills the list
      const controlledStudies = user && controlled.length > 0
        ? controlledQuery.filter((study, index, self) => (
          Object.keys(userControlledAccess.studies || {}).includes(study) && // is it allowed?
          index === self.indexOf(study) // is it unique?
        )).sort()
        : [];

      // validates and corrects the displayed URL if necessary
      (controlledStudies.length > 1 ||// Single study. Remove it when ready.
      !(
        controlledStudies.every(study => study.toUpperCase() === study) && // any study in lowercase
        controlledStudies.length === controlledQuery.length // any invalid study
      )) && push({
        pathname,
        ...(controlledStudies.length
          ? {
            query: {
              ...query,
              controlled: controlledStudies[0].toUpperCase(), // Single study. Remove it when ready.
              // controlled: controlledStudies.map(study => study.toUpperCase()), // clean URL
              // ^^^ ready for whenever they enable querying multiple controlled studies
            },
            queryOptions: { arrayFormat: 'comma' },
          }
          : {
            query: omit(query, ['controlled']),
          }
        ),
      });

      return {
        controlledAccessProps: DISPLAY_DAVE_CA
          ? {
            controlledStudies,
            showControlledAccessModal: () => {
              dispatch(setModal(
                <ControlledAccessModal
                  activeControlledPrograms={controlledStudies}
                  closeModal={() => dispatch(setModal(null))}
                  studiesSummary={studiesSummary}
                  />,
              ));
            },
          }
          : {},
        controlledAccessQueryParams: checkUserAccess(
          userControlledAccess.studies,
          controlledStudies,
        ),
      };
    },
  ),
  withHandlers({
    addControlledAccessParams: ({
      controlledAccessQueryParams,
    }) => (
      query = '',
      wholeReq,
    ) => {
      // reminder/notification for developer mode, due to lack of token.
      IS_DEV &&
        controlledAccessQueryParams.length &&
        console.info(
          `${query.toLowerCase().includes('requiresstudy') ? 'STUDY' : 'No study'} would be added to this request in Prod. Results actually shown are for open data only.`,
          wholeReq,
        );

      return (
        DISPLAY_DAVE_CA &&
        !IS_DEV &&
        controlledAccessQueryParams.length &&
        query.toLowerCase().includes('requiresstudy')
          // the first one instead of array, because "single study" ¯\_(ツ)_/¯
          ? { study: controlledAccessQueryParams[0] }
          // TODO: Revise when multiple studies are allowed
          // ? { study: controlledAccessQueryParams }
          : {}
      );
    },
  }),
  withContext(
    {
      ...CONTROLLED_ACCESS_CONTEXT,
      ...CONTROLLED_ACCESS_NETWORK,
    },
    ({
      addControlledAccessParams,
      controlledAccessProps,
    }) => ({
      addControlledAccessParams,
      controlledAccessProps,
    }),
  ),
);
