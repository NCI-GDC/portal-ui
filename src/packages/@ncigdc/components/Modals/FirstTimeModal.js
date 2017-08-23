// @flow
import React from 'react';
import { ExternalLink } from '@ncigdc/uikit/Links';
import BaseModal from '@ncigdc/components/Modals/BaseModal';

const FirstTimeModal = ({ onClose }) =>
  <BaseModal title="Warning" closeText="Accept" onClose={onClose}>
    <p>
      You are accessing a U.S. Government web site which may contain information
      that must be protected under the U. S. Privacy Act or other sensitive
      information and is intended for Government authorized use only.
    </p>
    <p>
      Unauthorized attempts to upload information, change information, or use of
      this web site may result in disciplinary action, civil, and/or criminal
      penalties. Unauthorized users of this web site should have no expectation
      of privacy regarding any communications or data processed by this web
      site.
    </p>
    <p>
      Anyone accessing this web site expressly consents to monitoring of their
      actions and all communication or data transiting or stored on or related
      to this web site and is advised that if such monitoring reveals possible
      evidence of criminal activity, NIH may provide that evidence to law
      enforcement officials.
    </p>
    <p>
      Please be advised that some features may not work with higher privacy
      settings, such as disabling cookies.
    </p>
    <p>
      <b>WARNING</b>
      : Data in the GDC is considered provisional as the GDC applies
      state-of-the art analysis pipelines which evolve over time. Please read
      the
      {' '}
      <ExternalLink
        hasExternalIcon={false}
        href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes"
      >
        GDC Data Release Notes
      </ExternalLink>
      {' '}
      prior to accessing this web site as the Release Notes provide details
      about data updates, known issues and workarounds.
    </p>
    <p>
      Contact
      {' '}
      <ExternalLink
        hasExternalIcon={false}
        href="https://gdc.cancer.gov/support#gdc-help-desk"
      >
        GDC Support
      </ExternalLink>
      {' '}
      for more information.
    </p>
  </BaseModal>;

export default FirstTimeModal;
