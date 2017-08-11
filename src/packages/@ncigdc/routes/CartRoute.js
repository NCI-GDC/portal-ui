// @flow
import React from 'react';
import { Route } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { setFilter } from '@ncigdc/utils/filters';
import { Row, Column } from '@ncigdc/uikit/Flex';
import FilesTable from '@ncigdc/modern_components/FilesTable';
import CartSummary from '@ncigdc/modern_components/CartSummary';
import MetadataDownloadButton from '@ncigdc/components/MetadataDownloadButton';
import HowToDownload from '@ncigdc/components/HowToDownload';
import CartDownloadDropdown from '@ncigdc/components/CartDownloadDropdown';
import RemoveFromCartButton from '@ncigdc/components/RemoveFromCartButton';

export default (
  <Route
    path="/cart"
    component={compose(
      connect(state => ({
        ...state.cart,
        ...state.auth,
      })),
    )(
      ({
        viewer,
        files,
        user,
        defaultFilters = files.length
          ? setFilter({
              field: 'files.file_id',
              value: files.map(f => f.file_id),
            })
          : null,
        styles = {
          container: {
            padding: '2rem 2.5rem 13rem',
          },
        },
      }) => {
        return (
          <Column style={styles.container} className="test-cart-page">
            {!files.length && <h1>Your cart is empty.</h1>}
            {!!files.length &&
              <Column>
                <Row style={{ marginBottom: '2rem', flexWrap: 'wrap' }}>
                  <CartSummary defaultFilters={defaultFilters} files={files} />
                  <HowToDownload
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      minWidth: '18em',
                      flexShrink: 0,
                    }}
                  />
                </Row>
                <Row style={{ marginBottom: '2rem' }}>
                  <Row
                    style={{ marginLeft: 'auto', zIndex: 10 }}
                    spacing="1rem"
                  >
                    <MetadataDownloadButton files={{ files }} />
                    <CartDownloadDropdown files={files} user={user} />
                    <RemoveFromCartButton user={user} />
                  </Row>
                </Row>
                <FilesTable
                  downloadable={false}
                  canAddToCart={false}
                  tableHeader={'Cart Items'}
                  defaultFilters={defaultFilters}
                />
              </Column>}
          </Column>
        );
      },
    )}
  />
);
