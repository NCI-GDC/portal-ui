import React from 'react';
import { connect } from 'react-redux';
import {
  isEqual,
  omit,
} from 'lodash';
import {
  compose,
  lifecycle,
  setDisplayName,
  withHandlers,
  withPropsOnChange,
  withState,
} from 'recompose';

import { fetchApi } from '@ncigdc/utils/ajax';
import withRouter from '@ncigdc/utils/withRouter';
import ControlledAccessModal from '@ncigdc/components/Modals/ControlledAccess';
import { setModal } from '@ncigdc/dux/modal';

import {
  DEV_CA_SUMMARY,
  DEV_USER_CA,
  DISPLAY_DAVE_CA,
  IS_DEV,
} from '@ncigdc/utils/constants';

import {
  reshapeSummary,
  reshapeUserAccess,
} from './helpers';

export default compose(
  setDisplayName('withControlledAccess'),
  connect(state => ({
    token: state.auth.token,
    user: state.auth.user,
    userControlledAccess: state.auth.userControlledAccess,
  })),
  withRouter,
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
      IS_DEV
        ? setStudiesSummary(reshapeSummary(DEV_CA_SUMMARY))
        : fetchApi(
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
    }) => (user
      ? userControlledAccess.fetched || (
        IS_DEV
          ? storeUserAccess(DEV_USER_CA)
          : fetchApi(
            '/studies/user',
            // {
            //   credentials: 'same-origin',
            //   headers: {
            //     'Access-Control-Allow-Origin': true,
            //     'Content-Type': 'application/json',
            //     'X-Auth-Token': 'secret admin token',
            //   },
            // },
          )
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

      return DISPLAY_DAVE_CA && {
        controlledAccessProps: {
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
        },
      };
    },
  ),
  lifecycle({
    componentDidMount() {
      const {
        fetchStudiesList,
      } = this.props;

      fetchStudiesList();
    },
  }),
);
