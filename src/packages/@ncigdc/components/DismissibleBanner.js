// @flow

import React from 'react';
import { connect } from 'react-redux';
import Row from '@ncigdc/uikit/Flex/Row';
import Button from '@ncigdc/uikit/Button';

import { setModal } from '@ncigdc/dux/modal';

const DismissibleBanner = ({ dispatch }) =>
  <Row data-test="banner">
    <strong>{`Can't find your data?`}</strong>
    <span
      className="header-banner-link"
      onClick={() =>
        dispatch(
          setModal(
            <div style={{ position: 'relative', padding: '15px' }}>
              <h2 className="banner-title">
                <span style={{ color: '#6b6262' }}>
                  {`Can't find your data?`}
                </span>
                <span className="banner-title-link">
                  You may be looking for the
                  {' '}
                  <a
                    href="https://portal.gdc.cancer.gov/legacy-archive/search/f"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GDC Legacy Archive
                  </a>
                  .
                </span>
              </h2>
              <div>
                <p>
                  Data in the GDC Data Portal has been harmonized using GDC
                  Bioinformatics Pipelines whereas data in the
                  GDC Legacy Archive is an unmodified copy of data that was
                  previously stored in CGHub and in the TCGA Data Portal hosted
                  by the TCGA Data Coordinating Center (DCC).
                  Certain previously available data types and formats are not
                  currently supported by the GDC Data Portal and are only
                  distributed via the GDC Legacy Archive.
                </p>
              </div>
              <Row
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <p
                  style={{
                    marginBottom: '0',
                  }}
                >
                  Check the
                  {' '}
                  <a
                    href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Data Release Notes
                  </a>
                  {' '}
                  for additional details.
                </p>
                <Button onClick={() => dispatch(setModal(null))}>
                  <span>OK</span>
                </Button>
              </Row>
            </div>,
          ),
        )}
    >
      Click here for more information.
    </span>

  </Row>;

export default connect()(DismissibleBanner);
