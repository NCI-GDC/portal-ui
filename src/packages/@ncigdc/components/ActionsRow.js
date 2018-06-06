import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import { stringifyJSONParam } from '@ncigdc/utils/uri';

import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import withRouter from '@ncigdc/utils/withRouter';
import AnnotationsLink from '@ncigdc/components/Links/AnnotationsLink';
import { CreateRepositoryCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import { fetchFilesAndAdd } from '@ncigdc/dux/cart';
import { ShoppingCartIcon } from '@ncigdc/theme/icons';
import DownloadManifestButton from '@ncigdc/components/DownloadManifestButton';
import type { TGroupFilter } from '@ncigdc/utils/filters/types';
import { DISPLAY_SLIDES } from '@ncigdc/utils/constants';
import { RepositorySlideCount } from '@ncigdc/modern_components/Counts';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Spinner from '@ncigdc/theme/icons/Spinner';
import styled from '@ncigdc/theme/styled';
import { linkButton } from '@ncigdc/theme/mixins';
import ImageViewerLink from '@ncigdc/components/Links/ImageViewerLink';
import { withTheme } from '@ncigdc/theme';
import { AWG } from '@ncigdc/utils/constants';

import pluralize from '@ncigdc/utils/pluralize';

const ImageViewerLinkAsButton = styled(ImageViewerLink, {
  padding: '9px 12px',
  marginLeft: '5px',
  ...linkButton,
});

export default compose(
  connect(),
  withRouter,
  withTheme,
)(
  ({
    filters,
    totalCases,
    dispatch,
    totalFiles,
    push,
    theme,
  }: {
    filters: TGroupFilter,
    totalCases: number,
    totalFiles: number,
    dispatch: Function,
    push: Function,
  }) => {
    return (
      <Row
        style={{
          justifyContent: 'space-between',
          padding: '0 0 2rem',
          alignItems: 'center',
        }}
      >
        <Row spacing="0.2rem">
          <Button
            onClick={() => dispatch(fetchFilesAndAdd(filters, totalFiles))}
            leftIcon={<ShoppingCartIcon />}
          >
            Add All Files to Cart
          </Button>
          <DownloadManifestButton fileCount={totalFiles} filters={filters} />
          {/* <CreateRepositoryCaseSetButton
            filters={filters}
            disabled={!totalCases}
            style={{ paddingLeft: '5px' }}
            onComplete={setId => {
              push({
                pathname: '/exploration',
                query: {
                  filters: stringifyJSONParam({
                    op: 'AND',
                    content: [
                      {
                        op: 'IN',
                        content: {
                          field: 'cases.case_id',
                          value: [`set_id:${setId}`],
                        },
                      },
                    ],
                  }),
                },
              });
            }}
          >
            {'View '}
            {totalCases.toLocaleString()} {pluralize(' Case', totalCases)}
            {' in Exploration'}

          </CreateRepositoryCaseSetButton> */}

          {!AWG && (
            <CreateRepositoryCaseSetButton>
              {DISPLAY_SLIDES && (
                <RepositorySlideCount filters={filters}>
                  {(count, loading) => (
                    <span style={{ marginTop: '7px' }}>
                      <Tooltip
                        Component={count === 0 ? 'No images available' : null}
                      >
                        <ImageViewerLinkAsButton
                          query={{
                            filters,
                          }}
                          style={
                            loading || count === 0
                              ? {
                                  backgroundColor: theme.greyScale4,
                                  pointerEvents: 'none',
                                }
                              : { cursor: 'pointer' }
                          }
                        >
                          {loading && (
                            <Spinner style={{ marginRight: '5px' }} />
                          )}
                          View Images
                        </ImageViewerLinkAsButton>
                      </Tooltip>
                    </span>
                  )}
                </RepositorySlideCount>
              )}
            </CreateRepositoryCaseSetButton>
          )}
        </Row>
        <AnnotationsLink>
          <i className="fa fa-edit" /> Browse Annotations
        </AnnotationsLink>
      </Row>
    );
  },
);
