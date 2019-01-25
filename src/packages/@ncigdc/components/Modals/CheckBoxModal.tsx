import React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import BaseModal, {
  IBaseModalProps,
} from '@ncigdc/components/Modals/BaseModal';
import withRouter from '@ncigdc/utils/withRouter';
import { setModal, IModalAction } from '@ncigdc/dux/modal';
import { IUserProps } from '@ncigdc/utils/auth/types';

export interface ICheckBoxModalProps {
  dbGapList?: string[];
  dispatch: (action: IModalAction) => void;
  hidden?: boolean;
  setAgreed: (agreed: boolean) => void;
  agreed: boolean;
  children: React.ComponentType;
  CustomButton: (agreed: boolean) => JSX.Element;
  user?: IUserProps;
  style: React.CSSProperties;
}
const CheckBoxModal = ({
  dbGapList = [],
  dispatch,
  hidden = false,
  setAgreed,
  agreed,
  children,
  CustomButton,
  user,
  style,
}: ICheckBoxModalProps) => {
  let dbGapLink =
    dbGapList.length === 1
      ? 'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=' +
        dbGapList[0]
      : 'https://www.ncbi.nlm.nih.gov/gap/?term=' +
        dbGapList.reduce((acc, d) => acc + '(' + d + '%5BStudy%5D)+OR+', '');
  if (dbGapLink.substr(dbGapLink.length - 4) === '+OR+') {
    dbGapLink = dbGapLink.slice(0, dbGapLink.length - 4);
  }
  return (
    <BaseModal
      title="Access Alert"
      extraButtons={CustomButton(agreed)}
      closeText="Cancel"
      style={style}
    >
      {children}
      {hidden ? null : (
        <div>
          <div style={{ marginBottom: '10px' }}>
            You are attempting to download files that are controlled access:
          </div>
          <input
            aria-label={'Agree to GDC data use'}
            type="checkbox"
            onClick={() => {
              setAgreed(!agreed);
            }}
            checked={agreed}
          />{' '}
          I agree to abide by the GDC{' '}
          <a
            href="https://gdc.cancer.gov/about-data/data-analysis-policies"
            target="_blank"
            rel="noopener noreferrer"
          >
            Data Use Agreement
          </a>{' '}
          and the study-specific Data Use Certification Agreement available in{' '}
          <a href={dbGapLink} target="_blank" rel="noopener noreferrer">
            dbGaP
          </a>. This means:
          <ul style={{ marginTop: '10px' }}>
            <li>
              I agree not to attempt to reidentify any individual participant in
              any study represented by GDC data, for any purpose whatever.
            </li>
            <li>
              I agree to have read and understand study-specific Data Use
              Agreements and to comply with any additional restrictions therein.
            </li>
            <li>
              I agree to abide by the{' '}
              <a
                href="https://osp.od.nih.gov/scientific-sharing/policies/"
                target="_blank"
                rel="noopener noreferrer"
              >
                NIH Genomic Data Sharing Policy (GDS)
              </a>.
            </li>
          </ul>
        </div>
      )}
    </BaseModal>
  );
};

export default compose<ICheckBoxModalProps, IBaseModalProps>(
  withState('agreed', 'setAgreed', false),
  lifecycle({
    componentWillReceiveProps(nextProps: ICheckBoxModalProps) {
      if (nextProps.user && !this.props.user) {
        nextProps.dispatch(setModal(null));
      }
    },
  }),
  withRouter
)(CheckBoxModal);
