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
} from '@ncigdc/utils/constants';

import {
  checkUserAccess,
  reshapeSummary,
} from './helpers';


export default compose(
  setDisplayName('withControlledAccess'),
  connect(state => ({
    token: state.auth.token,
    user: state.auth.user,
  })),
  withRouter,
  withState('userAccessList', 'setUserAccessList', []),
  withState('studiesList', 'setStudiesList', []),
  withHandlers({
    fetchStudiesList: ({ setStudiesList }) => () => (
      fetchApi(
        '/studies/summary/all',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
        .then(({ data } = {}) => {
          data && setStudiesList(reshapeSummary(data));
        })
        .catch(error => console.error(error))
    ),
    fetchUserAccess: ({ setUserAccessList }) => () => (
      // fetchApi(
      //   '/studies/user',
      //   {
      //     credentials: 'same-origin',
      //     headers: {
      //       'Access-Control-Allow-Origin': true,
      //       'Content-Type': 'application/json',
      //       'X-Auth-Token': 'secret admin token',
      //     },
      //   },
      // ).then((response) => {
      //   console.log('user?', response);
      // })
      setUserAccessList(['tcga'])
    ),
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
      fetchUserAccess,
      user,
    }) => {
      user && fetchUserAccess();
    },
  ),
  withPropsOnChange(
    (
      {
        query: {
          controlled,
        },
        studiesList,
        user,
      },
      {
        query: {
          controlled: nextControlled,
        },
        studiesList: nextStudiesList,
        user: nextUser,
      },
    ) => !(
      controlled === nextControlled &&
      isEqual(studiesList, nextStudiesList) &&
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
      studiesList,
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
                studiesList={studiesList}
                userAccessList={userAccessList}
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
