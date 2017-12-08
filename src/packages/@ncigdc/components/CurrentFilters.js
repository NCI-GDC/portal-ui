// @flow
import React from 'react';
import { take, xor, omit, some } from 'lodash';
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
  lifecycle,
} from 'recompose';

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
import GeneSymbol from '@ncigdc/modern_components/GeneSymbol';
import SetId from '@ncigdc/components/SetId';
import { parseJSONParam } from '@ncigdc/utils/uri/index';
import {
  addInFilters,
  makeFilter,
  fieldInCurrentFilters,
  removeFilter,
} from '@ncigdc/utils/filters';
import { stringifyJSONParam, parseFilterParam } from '@ncigdc/utils/uri';

/*----------------------------------------------------------------------------*/

const Field = styled(Button, {
  backgroundColor: ({ theme }) => theme.greyScale2,
  ':hover': {
    backgroundColor: ({ theme }) =>
      Color(theme.greyScale2)
        .lighten(0.7)
        .rgbString(),
  },
});

const Value = styled(Button, {
  backgroundColor: ({ theme }) => theme.success,
  ':hover': {
    backgroundColor: ({ theme }) =>
      Color(theme.success)
        .lighten(0.7)
        .rgbString(),
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
  displayedFilters: Array<Object>,
  onLessClicked: Function,
  isFilterExpanded: Function,
  style: Object,
  linkPathname?: string,
  linkText?: string,
  linkFieldMap?: Function,
  hideLinkOnEmpty: boolean,
  getDisplayValue: Function,
  hideHelpText?: boolean,
  hideClearButton?: boolean,
};

export const getDisplayOp = (op: string, value: Array<string>) => {
  if (op.toLowerCase() === 'in') {
    if (value.length === 1) {
      if (typeof value[0] === 'string' && value[0].includes('set_id')) {
        return 'IN';
      }
      return 'IS';
    }
    return 'IN';
  }
  return op;
};

const addCanonicalFilterFields = [
  'ssms.consequence.transcript.annotation.polyphen_impact',
  'ssms.consequence.transcript.annotation.sift_impact',
  'ssms.consequence.transcript.annotation.impact',
];

const enhance = compose(
  withRouter,
  withPropsOnChange(['query'], ({ query: { filters } }) => ({
    filters: parseJSONParam(filters),
  })),
  withPropsOnChange(['filters'], ({ filters }) => ({
    currentFilters: (filters && filters.content) || [],
  })),
  //if there are any impact fields in filters, automatically add is_canonical
  withPropsOnChange(['currentFilters'], ({ query, currentFilters, push }) => {
    if (
      some(addCanonicalFilterFields, field =>
        fieldInCurrentFilters({ currentFilters, field }),
      ) &&
      !fieldInCurrentFilters({
        currentFilters,
        field: 'ssms.consequence.transcript.is_canonical',
      })
    ) {
      push({
        query: {
          ...query,
          filters: stringifyJSONParam(
            addInFilters(
              parseFilterParam(query.filters),
              makeFilter([
                {
                  field: 'ssms.consequence.transcript.is_canonical',
                  value: ['true'],
                },
              ]),
            ),
          ),
        },
      });
    }
  }),
  // if any impact fields removed, automatically remove is_canonical
  lifecycle({
    componentWillReceiveProps(nextProps: Object): void {
      const nextFilters = nextProps.currentFilters;
      const { currentFilters, query, push } = this.props;
      if (
        some(
          addCanonicalFilterFields,
          field =>
            fieldInCurrentFilters({ currentFilters, field }) &&
            !fieldInCurrentFilters({ currentFilters: nextFilters, field }),
        )
      ) {
        push({
          query: {
            ...query,
            filters: stringifyJSONParam(
              removeFilter(
                'ssms.consequence.transcript.is_canonical',
                nextProps.filters,
              ),
            ),
          },
        });
      }
    },
  }),
  //hide is_canonical
  withPropsOnChange(['currentFilters'], ({ filters }) => ({
    displayedFilters:
      (filters &&
        filters.content &&
        (removeFilter('ssms.consequence.transcript.is_canonical', filters) || {}
        ).content) ||
      [],
  })),
  withState('expandedFilters', 'setExpandedFilters', []),
  withProps(({ expandedFilters }) => ({
    isFilterExpanded: filter => expandedFilters.includes(filter),
  })),
  withProps(() => ({
    getDisplayValue: (field, value) => {
      switch (typeof value) {
        case 'string':
          if (value.includes('set_id:')) {
            return <SetId set={value} />;
          }
          if (field === 'genes.gene_id') {
            return <GeneSymbol geneId={value} />;
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
    displayedFilters,
    onLessClicked,
    isFilterExpanded,
    style,
    linkPathname,
    linkText,
    linkFieldMap = f => f,
    hideLinkOnEmpty = true,
    getDisplayValue,
    hideHelpText = false,
    hideClearButton = false,
  }: TProps = {},
) => (
  <Info style={style} className="test-current-filters">
    {!displayedFilters.length &&
      !hideHelpText && (
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
        </span>
      )}
    {!!displayedFilters.length && (
      <Row
        style={{
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Row wrap spacing="0.3rem">
          {!hideClearButton && (
            <NotUnderlinedLink
              className="test-clear"
              style={styles.groupPadding}
              query={omit(query, 'filters')}
            >
              <Button leftIcon={<UndoIcon />}>Clear</Button>
            </NotUnderlinedLink>
          )}

          {displayedFilters.map((filter, i) => {
            const value = [].concat(filter.content.value || []);

            return (
              <Row
                key={`${filter.content.field}.${filter.op}.${value.join()}`}
                spacing="0.3rem"
                style={styles.groupPadding}
              >
                <NotUnderlinedLink
                  className="test-field-name"
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
                <Op>{getDisplayOp(filter.op, value)}</Op>
                {value.length > 1 && <span style={styles.leftParen}>(</span>}
                {(isFilterExpanded(filter)
                  ? value
                  : take(value, 2)
                ).map(value => (
                  <NotUnderlinedLink
                    className="test-field-value"
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
                  </NotUnderlinedLink>
                ))}
                {value.length > 2 && (
                  <UnstyledButton
                    className="test-toggle"
                    style={styles.rightParen}
                    onClick={() => onLessClicked(filter)}
                  >
                    …
                  </UnstyledButton>
                )}
                {isFilterExpanded(filter) && (
                  <UnstyledButton
                    className="test-toggle"
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={() => onLessClicked(filter)}
                  >
                    Less
                  </UnstyledButton>
                )}
                {value.length > 1 && <span style={styles.rightParen}>)</span>}
                {i < displayedFilters.length - 1 && <Op>AND</Op>}
              </Row>
            );
          })}
        </Row>
      </Row>
    )}
    {linkPathname &&
      (!hideLinkOnEmpty || !!displayedFilters.length) && (
        <LinkButton
          pathname={linkPathname}
          query={
            displayedFilters.length && {
              filters: {
                op: 'and',
                content: displayedFilters.map(
                  ({ content: { field, value }, op }) => ({
                    op: op.toLowerCase(),
                    content: { field: linkFieldMap(field), value },
                  }),
                ),
              },
            }
          }
        >
          <Cogs style={{ marginRight: 5 }} />
          {linkText}
        </LinkButton>
      )}
  </Info>
);
/*----------------------------------------------------------------------------*/

export default enhance(CurrentFilters);
