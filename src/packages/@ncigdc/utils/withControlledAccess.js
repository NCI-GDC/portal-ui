import React from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
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

const userAccessList = [];

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
      query: {
        controlled = '',
      },
      studiesList,
      user,
    }) => {
      const controlledStudies = user && controlled.length > 0 ? controlled.toLowerCase().split(',') : [];

      return DISPLAY_DAVE_CA && controlledStudies && {
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
