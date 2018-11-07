// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import BaseModal from '@ncigdc/components/Modals/BaseModal';
import withRouter from '@ncigdc/utils/withRouter';

const enhance = compose(withState('agreed', 'setAgreed', false), withRouter);

const RemoveSetModal = ({
  dbGapList = [],
  single = false,
  extraButtons,
  dispatch,
  setAgreed,
  agreed,
  children,
  CustomButton,
}) => {
  let dbGapLink = single
    ? 'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=' +
      dbGapList[0]
    : 'https://www.ncbi.nlm.nih.gov/gap/?term=' +
      dbGapList.reduce((acc, d) => acc + '(' + d + ')+OR+', '');
  if (dbGapLink.substr(dbGapLink.length - 4) === '+OR+') {
    dbGapLink = dbGapLink.slice(0, dbGapLink.length - 4);
  }
  return (
    <BaseModal
      title="Access Error"
      extraButtons={CustomButton(agreed)}
      closeText="Cancel"
    >
      {children}
      <div>
        <input
          type="checkbox"
          onClick={() => {
            setAgreed(!agreed);
          }}
          checked={agreed}
        />{' '}
        You are downloading controlled access data and must abide by the
        associated{' '}
        <a href="https://gdc.cancer.gov/about-data/data-analysis-policies">
          Data Use Agreement
        </a>{' '}
        available in <a href={dbGapLink}>dbGaP</a>.
      </div>
    </BaseModal>
  );
};

export default enhance(RemoveSetModal);
