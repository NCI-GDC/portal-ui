/* @flow */

import { Row, Column } from '@ncigdc/uikit/Flex';
import styled from '@ncigdc/theme/styled';

import Link from '@ncigdc/components/Links/Link';

export const Container = styled(Column, {
  padding: '0 1.2rem 1rem 1.2rem',
  backgroundColor: 'white',
});

export const InputLabel = styled.label({
  backgroundColor: ({ theme }) => theme.greyScale5,
  color: ({ theme }) => theme.greyScale2,
  padding: '0.8rem',
  height: '3.4rem',
  border: ({ theme }) => `1px solid ${theme.greyScale4}`,
});

export const GoLink = styled(Link, {
  color: ({ theme, dark }) => (dark ? theme.greyScale1 : theme.greyScale2),
  textDecoration: 'none',
  border: ({ theme }) => `1px solid ${theme.greyScale4}`,
  borderLeft: 0,
  padding: '6px 4px 2px 4px',
  height: '3.4rem',
  borderRadius: '0 4px 4px 0',
  ':link': ({ theme, dark }) => ({
    textDecoration: 'none',
    color: dark ? theme.greyScale1 : theme.greyScale2,
  }),
});

export const CheckedRow = styled(Row, {
  padding: '0.25rem',
  fontSize: '1.5rem',
});

export const CheckedLink = styled(Link, {
  color: ({ theme }) => theme.success,
  textDecoration: 'none',
  ':link': {
    textDecoration: 'none',
    color: ({ theme }) => theme.success,
  },
});

export const facetFieldDisplayMapper = field => {
  const map = {
    'genes.symbol': 'Gene Symbol',
    'genes.gene_id': 'Gene',
    'cases.case_id': 'Case',
  };
  return map[field] || field;
};

export const BucketLink = styled(Link, {
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  color: ({ theme }) => theme.greyScale1,
  ':link': {
    textDecoration: 'none',
    color: ({ theme }) => theme.greyScale1,
  },
  marginBottom: '0.5rem',
});
