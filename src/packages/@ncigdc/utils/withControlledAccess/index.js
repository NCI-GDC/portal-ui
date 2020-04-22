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
  DISPLAY_DAVE_CA,
  IS_DEV,
} from '@ncigdc/utils/constants';

import {
  reshapeSummary,
  reshapeUserAccess,
} from './helpers';


const FAKE_USER_ACCESS = [ // controlled access mock
  {
    programs: [
      {
        name: 'TARGET',
        projects: ['TARGET-ALL-P1', 'TARGET-ALL-P2'],
      },
    ],
  },
];

export default compose(
  setDisplayName('withControlledAccess'),
  connect(state => ({
    token: state.auth.token,
    user: state.auth.user,
    userControlledAccess: state.auth.userControlledAccess,
  })),
  withRouter,
  withState('userAccessList', 'setUserAccessList', []),
  withState('studiesSummary', 'setStudiesSummary', {}),
  withHandlers({
    clearUserAccess: ({
      dispatch,
      setUserAccessList,
      userAccessList,
      userControlledAccess,
    }) => () => {
      userAccessList.length > 0 && setUserAccessList([]);
      Object.keys(userControlledAccess).length > 0 &&
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
      setUserAccessList,
    }) => controlled => {
      const userControlledAccess = reshapeUserAccess(controlled);

      setUserAccessList(Object.keys(userControlledAccess));
      dispatch({
        payload: userControlledAccess,
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
    }) => (user
      ? IS_DEV
        ? storeUserAccess(FAKE_USER_ACCESS)
        : fetchApi(
          '/studies/user',
          {
            credentials: 'same-origin',
            headers: {
              'Access-Control-Allow-Origin': true,
              'Content-Type': 'application/json',
              'X-Auth-Token': 'secret admin token',
            },
          },
        )
          .then(({ data }) => {
            storeUserAccess(data.controlled);
          })
          .catch(error => {
            console.error('while fetching user controlled access', error);
            clearUserAccess();
          })
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
      userAccessList,
    }) => {
      // gets the whole array of 'controlled' from the URL
      const controlledQuery = Array.isArray(controlled)
        ? controlled.map(study => study.toLowerCase().split(',')).flat()
        : controlled.toLowerCase().split(',');

      // distills the list
      const controlledStudies = user && controlled.length > 0
        ? controlledQuery.filter((study, index, self) => (
          userAccessList.includes(study) && // is it allowed?
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
                querySelectedStudies={() => {}}
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
