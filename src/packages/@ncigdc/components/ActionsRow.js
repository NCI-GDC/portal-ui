import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import { stringifyJSONParam } from '@ncigdc/utils/uri';

import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import withRouter from '@ncigdc/utils/withRouter';
import { CreateRepositoryCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import { fetchFilesAndAdd } from '@ncigdc/dux/cart';
import { ShoppingCartIcon } from '@ncigdc/theme/icons';
import DownloadManifestButton from '@ncigdc/components/DownloadManifestButton';
import { IGroupFilter } from '@ncigdc/utils/filters/types';
import { DISPLAY_SLIDES, AWG } from '@ncigdc/utils/constants';
import { RepositorySlideCount } from '@ncigdc/modern_components/Counts';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Spinner from '@ncigdc/theme/icons/Spinner';
import styled from '@ncigdc/theme/styled';
import { linkButton } from '@ncigdc/theme/mixins';
import ImageViewerLink from '@ncigdc/components/Links/ImageViewerLink';
import { withTheme } from '@ncigdc/theme';
import pluralize from '@ncigdc/utils/pluralize';


const ImageViewerLinkAsButton = styled(ImageViewerLink, {
  padding: '9px 12px 10px 12px',
  ...linkButton,
});

export default compose(
  connect(),
  withRouter,
  withTheme,
)(
  ({
    dispatch,
    filters,
    push,
    theme,
    totalCases,
    totalFiles,
  }: {
    filters: IGroupFilter,
    totalCases: number,
    totalFiles: number,
    dispatch: Function,
    push: Function,
    theme: any,
  }) => {
    return (
      <Row
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 0 5px',
        }}
        >
        <Row
          style={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
          >
          <Button
            leftIcon={<ShoppingCartIcon />}
            onClick={() => dispatch(fetchFilesAndAdd(filters, totalFiles))}
            style={{ margin: '5px 2px 0px 3px' }}
            >
            Add All Files to Cart
          </Button>

          <DownloadManifestButton fileCount={totalFiles} filters={filters} style={{ margin: '5px 2px 0px 3px' }} />
          {AWG || (filters
            ? (
              <CreateRepositoryCaseSetButton
                disabled={!totalCases}
                filters={filters}
                onComplete={(setId: String) => {
                  push({
                    pathname: '/exploration',
                    query: {
                      filters: stringifyJSONParam({
                        content: [
                          {
                            content: {
                              field: 'cases.case_id',
                              value: [`set_id:${setId}`],
                            },
                            op: 'IN',
                          },
                        ],
                        op: 'AND',
                      }),
                    },
                  });
                }}
                style={{ margin: '5px 2px 0px 3px' }}
                >
                {`View ${totalCases.toLocaleString()} ${pluralize(' Case', totalCases)} in Exploration`}
              </CreateRepositoryCaseSetButton>
            ) : (
              <Button
                disabled={!totalCases}
                onClick={() =>
                  push({
                    pathname: '/exploration',
                  })}
                style={{ margin: '5px 2px 0px 3px' }}
                >
                {`View ${totalCases.toLocaleString()} ${pluralize(' Case', totalCases)} in Exploration`}
              </Button>
            ))}

          {DISPLAY_SLIDES && (
            <div style={{ margin: '11px 2px 0px 3px' }}>
              <RepositorySlideCount filters={filters}>
                {(count: Number, loading: Boolean) => (
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
                      {loading && <Spinner style={{ marginRight: '5px' }} />}
                      View Images
                    </ImageViewerLinkAsButton>
                  </Tooltip>
                )}
              </RepositorySlideCount>
            </div>
          )}
        </Row>
      </Row>
    );
  },
);
