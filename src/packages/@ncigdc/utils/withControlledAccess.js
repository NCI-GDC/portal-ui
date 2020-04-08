import React from 'react';
import { connect } from 'react-redux';
import {
  isEqual,
  omit,
} from 'lodash';
import {
  compose,
  setDisplayName,
  withPropsOnChange,
  withState,
} from 'recompose';

import withRouter from '@ncigdc/utils/withRouter';
import ControlledAccessModal from '@ncigdc/components/Modals/ControlledAccess';
import { setModal } from '@ncigdc/dux/modal';

import {
  DISPLAY_DAVE_CA,
} from '@ncigdc/utils/constants';

const dataStub = [
  {
    genes_mutations: 'controlled',
    program: 'fm',
  },
  {
    genes_mutations: 'controlled',
    program: 'genie',
  },
  {
    genes_mutations: 'open',
    program: 'tcga',
  },
  {
    program: 'target',
  },
  {
    program: 'mmrf',
  },
  {
    program: 'cptac',
  },
  {
    program: 'beataml 1.0',
  },
  {
    program: 'nciccr',
  },
  {
    program: 'ohu',
  },
  {
    program: 'cgci',
  },
  {
    program: 'wcdt',
  },
  {
    program: 'organoid',
  },
  {
    program: 'ctsp',
  },
  {
    program: 'hcmi',
  },
  {
    program: 'varpop',
  },
].map(stub => ({
  ...stub,
  cases_clinical: 'open',
  genes_mutations: stub.genes_mutations || 'in_process',
}));

const userAccessList = ['fm'];

export default compose(
  setDisplayName('withControlledAccess'),
  connect(state => ({
    user: state.auth.user,
  })),
  withRouter,
  withState('studiesList', 'setStudiesList', dataStub),
  withPropsOnChange(
    (
      {
        query: {
          controlled,
        },
        user,
      },
      {
        query: {
          controlled: nextControlled,
        },
        user: nextUser,
      },
    ) => !(
      controlled === nextControlled &&
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
);
