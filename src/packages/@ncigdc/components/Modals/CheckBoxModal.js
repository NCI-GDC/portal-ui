// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import BaseModal from '@ncigdc/components/Modals/BaseModal';
import withRouter from '@ncigdc/utils/withRouter';

const enhance = compose(withState('agreed', 'setAgreed', false), withRouter);

const CheckBoxModal = ({
  dbGapList = [],
  extraButtons,
  dispatch,
  hidden = false,
  setAgreed,
  agreed,
  children,
  CustomButton,
}) => {
  let dbGapLink =
    dbGapList.length === 1
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
      {hidden ? null : (
        <div>
          <input
            type="checkbox"
            onClick={() => {
              setAgreed(!agreed);
            }}
            checked={agreed}
          />{' '}
          I agree to abide by the GDC{' '}
          <a href="https://gdc.cancer.gov/about-data/data-analysis-policies">
            Data Use Agreement
          </a>{' '}
          and the study-specific Data Use Certification Agreement available in{' '}
          <a href={dbGapLink}>dbGaP</a>.
        </div>
      )}
    </BaseModal>
  );
};

export default enhance(CheckBoxModal);
