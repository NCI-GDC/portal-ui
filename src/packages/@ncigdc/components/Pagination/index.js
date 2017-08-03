/* @flow */

import React from 'react';
import _ from 'lodash';

import { Row } from '@ncigdc/uikit/Flex';
import { withTheme } from '@ncigdc/theme';

import PaginationButton from './PaginationButton';
import PaginationLink from './PaginationLink';
import Sizes from './Sizes';

export type TProps = {|
  params: Object,
  prefix?: string,
  total: number,
  theme: Object,
|};

const styles = {
  topRow: theme => ({
    alignItems: 'center',
    padding: '1rem',
    borderTop: `1px solid ${theme.greyScale5}`,
    backgroundColor: 'white',
  }),
  leftBtn: theme => ({
    border: `1px solid ${theme.greyScale5}`,
    borderRadius: '4px 0 0 4px',
  }),
  middleBtn: theme => ({
    borderTop: `1px solid ${theme.greyScale5}`,
    borderBottom: `1px solid ${theme.greyScale5}`,
    borderRight: `1px solid ${theme.greyScale5}`,
    borderLeft: 'none',
  }),
  rightBtn: theme => ({
    borderTop: `1px solid ${theme.greyScale5}`,
    borderBottom: `1px solid ${theme.greyScale5}`,
    borderRight: `1px solid ${theme.greyScale5}`,
    borderLeft: 'none',
    borderRadius: '0 4px 4px 0',
  }),
};

export const calculatePages = (props: TProps): {} => {
  const prfOff = [props.prefix, 'offset'].filter(Boolean).join('_');
  const prfSize = [props.prefix, 'size'].filter(Boolean).join('_');

  const offset = props.params[prfOff];
  const size = props.params[prfSize];
  const prev = Math.max(offset - size, 0);
  const last = props.total - props.total % size;
  const next = Math.min(offset + size, last);
  const prevPred = offset !== 0;
  const nextPred = offset < last;

  const currentPage = Math.ceil(offset / size) + 1;
  const totalPages = Math.ceil(props.total / size);
  const pageOffset = 10 * Math.floor((currentPage - 1) / 10);
  return {
    prfOff,
    prfSize,
    offset,
    size,
    prev,
    last,
    next,
    prevPred,
    nextPred,
    currentPage,
    totalPages,
    pageOffset,
  };
};

export const getPaginationRange = (pageOffset, totalPages) => {
  const numPagesToShow = 10;
  return _.range(
    1 + pageOffset,
    Math.min(numPagesToShow + pageOffset, totalPages) + 1,
  );
};

const Pagination = (props: TProps) => {
  const {
    prfOff,
    prfSize,
    size,
    prev,
    last,
    next,
    prevPred,
    nextPred,
    currentPage,
    totalPages,
    pageOffset,
  } = calculatePages(props);

  return (
    <Row style={styles.topRow(props.theme)}>
      <Row style={{ alignItems: 'center' }}>
        <span style={{ marginRight: '1rem' }}>Show</span>
        <Sizes
          prfSize={prfSize}
          prfOff={prfOff}
          size={size}
          sizes={props.sizes}
        />
        <span style={{ marginLeft: '1rem' }}>entries</span>
      </Row>

      <Row style={{ marginLeft: 'auto' }}>
        <PaginationLink pred={prevPred} prfOff={prfOff} offset={0}>
          <PaginationButton style={styles.leftBtn(props.theme)}>
            {'«'}
          </PaginationButton>
        </PaginationLink>
        <PaginationLink pred={prevPred} prfOff={prfOff} offset={prev}>
          <PaginationButton style={styles.middleBtn(props.theme)}>
            {'‹'}
          </PaginationButton>
        </PaginationLink>
        {getPaginationRange(pageOffset, totalPages).map(x =>
          <PaginationLink key={x} prfOff={prfOff} offset={(x - 1) * size} pred>
            <PaginationButton
              active={currentPage === x}
              style={styles.middleBtn(props.theme)}
            >
              {x}
            </PaginationButton>
          </PaginationLink>,
        )}
        <PaginationLink pred={nextPred} prfOff={prfOff} offset={next}>
          <PaginationButton style={styles.middleBtn(props.theme)}>
            {'›'}
          </PaginationButton>
        </PaginationLink>
        <PaginationLink pred={nextPred} prfOff={prfOff} offset={last}>
          <PaginationButton style={styles.rightBtn(props.theme)}>
            {'»'}
          </PaginationButton>
        </PaginationLink>
      </Row>
    </Row>
  );
};

export default withTheme(Pagination);
