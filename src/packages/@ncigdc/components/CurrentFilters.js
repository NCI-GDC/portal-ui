// @flow
import React from 'react';
import { take, xor, omit } from 'lodash';
import UndoIcon from 'react-icons/lib/md/undo';
import LeftArrow from 'react-icons/lib/fa/long-arrow-left';
import Cogs from 'react-icons/lib/fa/cogs';
import Color from 'color';
import {
  compose,
  withState,
  pure,
  withHandlers,
  withPropsOnChange,
  withProps,
} from 'recompose';
import JSURL from 'jsurl';

import { humanify } from '@ncigdc/utils/string';
import withRouter from '@ncigdc/utils/withRouter';

import Button, { buttonBaseStyles } from '@ncigdc/uikit/Button';
import { Row } from '@ncigdc/uikit/Flex';
import Info from '@ncigdc/uikit/Info';

import styled from '@ncigdc/theme/styled';
import { buttonLike } from '@ncigdc/theme/mixins';
import UnstyledButton from '@ncigdc/uikit/UnstyledButton';
import Link from '@ncigdc/components/Links/Link';

import { facetFieldDisplayMapper } from '@ncigdc/components/Aggregations';
import GeneSymbol from '@ncigdc/containers/GeneSymbol';

/*----------------------------------------------------------------------------*/

const Field = styled(Button, {
  backgroundColor: ({ theme }) => theme.greyScale2,
  ':hover': {
    backgroundColor: ({ theme }) =>
      Color(theme.greyScale2).lighten(0.7).rgbString(),
  },
});

const Value = styled(Button, {
  backgroundColor: ({ theme }) => theme.success,
  ':hover': {
    backgroundColor: ({ theme }) =>
      Color(theme.success).lighten(0.7).rgbString(),
  },
});

const Op = styled.span({
  ...buttonLike,
  backgroundColor: ({ theme }) => theme.primary,
  color: 'white',
});

const NotUnderlinedLink = styled(Link, {
  ':link': {
    textDecoration: 'none',
  },
});

const LinkButton = styled(Link, {
  ...buttonBaseStyles,
  flex: 'none',
  ':link': {
    textDecoration: 'none',
    color: buttonBaseStyles.color,
  },
});

type TProps = {
  query: Object,
  currentFilters: Array<Object>,
  onLessClicked: Function,
  isFilterExpanded: Function,
  style: Object,
  linkPathname?: string,
  linkText?: string,
  linkFieldMap?: Function,
  hideLinkOnEmpty: boolean,
};

export const getDisplayOp = (op: string, value: Array<string>) => {
  if (op.toLowerCase() === 'in') {
    if (value.length === 1) {
      if (value[0].includes('set_id')) {
        return 'IN';
      }
      return 'IS';
    }
    return 'IN';
  }
  return op;
};

const enhance = compose(
  withRouter,
  withPropsOnChange(['query'], ({ query: { filters } }) => ({
    filters: JSURL.parse(filters),
  })),
  withPropsOnChange(['filters'], ({ filters }) => ({
    currentFilters: (filters && filters.content) || [],
  })),
  withState('expandedFilters', 'setExpandedFilters', []),
  withProps(({ expandedFilters }) => ({
    isFilterExpanded: filter => expandedFilters.includes(filter),
  })),
  withProps(({ geneSymbolFragment }) => ({
    getDisplayValue: (field, value) => {
      switch (typeof value) {
        case 'string':
          if (field === 'genes.gene_id') {
            return <GeneSymbol explore={geneSymbolFragment} geneId={value} />;
          }
          if (value.includes('set_id:')) {
            return 'input set';
          }
          return value;
        case 'boolean':
          return value ? 'true' : 'false';
        case 'number':
          return value;
        default:
          return value;
      }
    },
  })),
  withHandlers({
    onLessClicked: ({ expandedFilters, setExpandedFilters }) => filter => {
      setExpandedFilters(xor(expandedFilters, [filter]));
    },
  }),
  pure,
);

const styles = {
  leftParen: {
    fontSize: '2rem',
    marginRight: '0.3rem',
    display: 'flex',
    alignItems: 'center',
  },
  rightParen: {
    fontSize: '2rem',
    marginRight: '0.3rem',
    display: 'flex',
    alignItems: 'center',
  },
  groupPadding: {
    padding: '0.5rem 0',
  },
};

const CurrentFilters = (
  {
    query,
    currentFilters,
    onLessClicked,
    isFilterExpanded,
    style,
    linkPathname,
    linkText,
    linkFieldMap = f => f,
    hideLinkOnEmpty = true,
    geneSymbolFragment,
    getDisplayValue,
  }: TProps = {},
) =>
  <Info style={style}>
    {!currentFilters.length &&
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          lineHeight: '44px',
          width: '100%',
        }}
      >
        <LeftArrow />
        <span style={{ marginLeft: '0.6rem' }}>
          Start searching by selecting a facet
        </span>
      </span>}
    {!!currentFilters.length &&
      <Row
        style={{
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Row wrap spacing="0.3rem">
          <NotUnderlinedLink
            style={styles.groupPadding}
            query={omit(query, 'filters')}
          >
            <Button leftIcon={<UndoIcon />}>Clear</Button>
          </NotUnderlinedLink>

          {currentFilters.map((filter, i) =>
            <Row
              key={`${filter.content
                .field}.${filter.op}.${filter.content.value.map(v => v)}`}
              spacing="0.3rem"
              style={styles.groupPadding}
            >
              <NotUnderlinedLink
                merge="toggle"
                query={{
                  offset: 0,
                  filters: {
                    op: 'and',
                    content: [filter],
                  },
                }}
              >
                <Field>
                  {humanify({
                    term: facetFieldDisplayMapper(filter.content.field),
                  })}
                </Field>
              </NotUnderlinedLink>
              <Op>
                {getDisplayOp(filter.op, filter.content.value)}
              </Op>
              {filter.content.value.length > 1 &&
                <span style={styles.leftParen}>(</span>}
              {(isFilterExpanded(filter)
                ? filter.content.value
                : take(filter.content.value, 2)).map(value =>
                <NotUnderlinedLink
                  key={value}
                  merge="toggle"
                  query={{
                    offset: 0,
                    filters: {
                      op: 'and',
                      content: [
                        {
                          op: filter.op,
                          content: {
                            field: filter.content.field,
                            value: [value],
                          },
                        },
                      ],
                    },
                  }}
                >
                  <Value>
                    {getDisplayValue(filter.content.field, value)}
                  </Value>
                </NotUnderlinedLink>,
              )}
              {filter.content.value.length > 2 &&
                <UnstyledButton
                  style={styles.rightParen}
                  onClick={() => onLessClicked(filter)}
                >
                  …
                </UnstyledButton>}
              {isFilterExpanded(filter) &&
                <UnstyledButton
                  style={{ display: 'flex', alignItems: 'center' }}
                  onClick={() => onLessClicked(filter)}
                >
                  Less
                </UnstyledButton>}
              {filter.content.value.length > 1 &&
                <span style={styles.rightParen}>)</span>}
              {i < currentFilters.length - 1 && <Op>AND</Op>}
            </Row>,
          )}
        </Row>
      </Row>}
    {linkPathname &&
      (!hideLinkOnEmpty || !!currentFilters.length) &&
      <LinkButton
        pathname={linkPathname}
        disabled={currentFilters
          .reduce((acc, f) => [...acc, ...f.content.value], [])
          .some(v => v.includes('set_id:'))}
        query={
          currentFilters.length && {
            filters: {
              op: 'AND',
              content: currentFilters.map(
                ({ content: { field, value }, op }) => ({
                  op,
                  content: { field: linkFieldMap(field), value },
                }),
              ),
            },
          }
        }
      >
        <Cogs style={{ marginRight: 5 }} />{linkText}
      </LinkButton>}
  </Info>;
/*----------------------------------------------------------------------------*/

export default enhance(CurrentFilters);
