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

import pluralize from '@ncigdc/utils/pluralize';

export default compose(
  connect(),
  withRouter,
)(
  ({
    filters,
    totalCases,
    dispatch,
    totalFiles,
    push,
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
          <CreateRepositoryCaseSetButton
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
          </CreateRepositoryCaseSetButton>
        </Row>
        <AnnotationsLink>
          <i className="fa fa-edit" /> Browse Annotations
        </AnnotationsLink>
      </Row>
    );
  },
);
