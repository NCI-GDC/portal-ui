import React from 'react';
import _ from 'lodash';
import { css } from 'glamor';
import ButtonGroup from './ButtonGroup';
import theme from '../theme';

const withPagination = (props = {}) => Wrapper => (
  class extends React.Component {
    state = {
      first: props.first || 10,
      offset: props.offset || 0,
    }

    setPagination = payload => this.setState(payload)

    render() {
      return (
        <Wrapper
          {...this.props}
          {...this.state}
          update={this.update}
        />
      );
    }
  }
);

const styles = {
  tableActionButtons: css({
    padding: '0.6rem',
    backgroundColor: 'white',
    color: theme.greyScale1,
    border: `1px solid ${theme.greyScale4}`,
  }),
  inactive: css({
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  }),
  active: css({
    backgroundColor: theme.secondary,
    color: 'white',
  }),
};

const PaginationHeader = props => (
  <span>
    <span>Showing </span>
    <strong>
      <span>{1 + (props.offset || 0)}</span>
      <span style={{ margin: '0 0.5rem' }}>-</span>
      <span>{props.offset + props.first}</span>
    </strong>
    <span> of</span>
    <strong> {props.total.toLocaleString()}</strong>
    <span>{props.entityType}</span>
  </span>
);

const PaginationBtn = ({ className, children, ...props }) => (
  <button
    className={`${styles.tableActionButtons} ${styles.inactive} ${className || ''}`}
    {...props}
  >
    {children}
  </button>
);

const PaginationControls = props => {
  const currentPage = (props.offset / props.first) + 1;
  const totalPages = props.total / props.first;
  const pageOffset = 10 * Math.floor((currentPage - 1) / 10);

  return (
    <ButtonGroup>
      <PaginationBtn onClick={() => props.setPagination({ offset: 0 })}>{'<<'}</PaginationBtn>
      <PaginationBtn onClick={() => props.setPagination({ offset: props.offset - props.first })}>
        {'<'}
      </PaginationBtn>
      {_.range(1 + pageOffset, Math.min(11 + pageOffset, totalPages)).map(x =>
        <PaginationBtn
          key={x}
          className={currentPage === x ? styles.active : styles.inactive}
          onClick={() => props.setPagination({ offset: ((x - 1) * props.first) })}
        >
          {x}
        </PaginationBtn>
      )}
      <PaginationBtn onClick={() => props.setPagination({ offset: props.offset + props.first })}>
        {'>'}
      </PaginationBtn>
      <PaginationBtn onClick={() => props.setPagination({ offset: (props.total - props.total) % props.size })}>
        {'>>'}
      </PaginationBtn>
    </ButtonGroup>
  );
};

export {
  withPagination,
  PaginationHeader,
  PaginationControls,
};
