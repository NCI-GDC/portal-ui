// @flow

import React from 'react';
import { connect } from 'react-redux';
import Row from '@ncigdc/uikit/Flex/Row';
import Button from '@ncigdc/uikit/Button';
import { ExternalLink } from '@ncigdc/uikit/Links';

import { setModal } from '@ncigdc/dux/modal';

const DismissibleBanner = ({ dispatch }) =>
  <Row>
    <strong>Can't find your data?</strong>
    <span
      className="header-banner-link"
      onClick={() =>
        dispatch(
          setModal(
            <div style={{ padding: '15px' }}>
              <h2 style={{ color: '#6b6262' }}>Can't find your data?</h2>
              <p>
                Some TARGET and TCGA data are not yet available in the GDC
                Data Portal.<br /><br />
                Some data is still in the process of submission including many
                TARGET data files. For the complete and latest TARGET data,
                please see the{' '}
                <ExternalLink href="https://ocg.cancer.gov/programs/target/data-matrix">
                  TARGET Data Matrix
                </ExternalLink>.<br /><br />
                Other data may be in the{' '}
                <ExternalLink href="https://portal.gdc.cancer.gov/legacy-archive/search/f">
                  GDC Legacy Archive
                </ExternalLink>. Data in the GDC
                Data Portal has been harmonized using GDC Bioinformatics
                Pipelines whereas data in the GDC Legacy Archive is an
                unmodified copy of data that was previously stored in CGHub
                and in the TCGA Data Portal hosted by the TCGA Data
                Coordinating Center (DCC). Certain previously available data
                types and formats are not currently supported by the GDC Data
                Portal and are only distributed via the GDC Legacy Archive.
              </p>
              <Row
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <p style={{ marginBottom: '0' }}>
                  Check the{' '}
                  <ExternalLink href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes/">
                    Data Release Notes
                  </ExternalLink>{' '}
                  for additional details.
                </p>
                <Button onClick={() => dispatch(setModal(null))}>OK</Button>
              </Row>
            </div>,
          ),
        )}
    >
      Click here for more information.
    </span>

  </Row>;

export default connect()(DismissibleBanner);
