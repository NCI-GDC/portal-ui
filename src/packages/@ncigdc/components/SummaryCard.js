// @flow

// Vendor
import React from 'react';
import PropTypes from 'prop-types';
import { compose, withPropsOnChange } from 'recompose';
import withSize from '@ncigdc/utils/withSize';

// Custom
import { Row, Column } from '@ncigdc/uikit/Flex';
import Card from '@ncigdc/uikit/Card';
import styled from '@ncigdc/theme/styled';
import EntityPageHorizontalTable from './EntityPageHorizontalTable';
import NoResultsMessage from '@ncigdc/components/NoResultsMessage';

/*----------------------------------------------------------------------------*/

const Header = styled(Row, {
  padding: '1rem',
  color: ({ theme }) => theme.greyScale7 || 'silver',
});

const SummaryCard = compose(
  withSize({ monitorHeight: true }),
  withPropsOnChange(['size'], ({ size }) => ({
    pieDiameter: Math.max(Math.min(size.width, size.height - 100), 120),
  })),
)(({ data, title, tableTitle, style = {}, footer, path, headings }) =>
  <Card style={style}>
    <Column>
      <Header>
        <span style={{ flexGrow: 1, fontSize: '1.7rem' }}>
          {tableTitle || title}
        </span>
      </Header>
      {!data.length && <NoResultsMessage style={{ textAlign: 'center' }} />}

      {!!data.length &&
        <EntityPageHorizontalTable
          headings={headings}
          data={data}
          style={{ overflow: 'hidden', borderLeft: 0, borderTop: 0 }}
        />}
    </Column>
  </Card>,
);

SummaryCard.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string,
  data: PropTypes.array,
  footer: PropTypes.node,
  path: PropTypes.string,
  table: PropTypes.object,
};

/*----------------------------------------------------------------------------*/

export default SummaryCard;
