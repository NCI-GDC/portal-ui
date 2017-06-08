// @flow

// Vendor
import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withPropsOnChange } from 'recompose';
import withSize from '@ncigdc/utils/withSize';

// Custom
import PieChart from '@ncigdc/components/Charts/PieChart';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Card from '@ncigdc/uikit/Card';
import styled from '@ncigdc/theme/styled';
import { center } from '@ncigdc/theme/mixins';
import EntityPageHorizontalTable from './EntityPageHorizontalTable';
import NoResultsMessage from '@ncigdc/components/NoResultsMessage';

/*----------------------------------------------------------------------------*/

const Header = styled(Row, {
  padding: '1rem',
  color: ({ theme }) => theme.greyScale7 || 'silver',
});

const Footer = styled(Row, {
  padding: '1rem',
  ...center,
});

const SummaryCard = compose(
  withState('showTable', 'setShowTable', true),
  withSize({ monitorHeight: true }),
  withPropsOnChange(['size'], ({ size }) => ({
    pieDiameter: Math.max(Math.min(size.width, size.height - 100), 120),
  })),
)(
  ({
    data,
    title,
    pieChartTitle,
    tableTitle,
    style = {},
    footer,
    path,
    showTable,
    setShowTable,
    headings,
    pieDiameter,
  }) =>
    <Card style={style}>
      <Column>
        <Header>
          <span style={{ flexGrow: 1, fontSize: '1.7rem' }}>
            {(showTable ? tableTitle : pieChartTitle) || title}
          </span>
          {!!data.length &&
            <span onClick={() => setShowTable(!showTable)}>
              <i
                style={{ color: '#000' }}
                className={`fa ${showTable ? 'fa-pie-chart' : 'fa-table'}`}
              />
            </span>}
        </Header>
        {!data.length && <NoResultsMessage style={{ textAlign: 'center' }} />}

        {showTable &&
          !!data.length &&
          <EntityPageHorizontalTable
            headings={headings}
            data={data}
            style={{ overflow: 'hidden', borderLeft: 0, borderTop: 0 }}
          />}
        {!showTable &&
        !!data.length && [
          <PieChart
            key="chart"
            data={data}
            path={path}
            height={pieDiameter}
            width={pieDiameter}
          />,
          footer && <Footer key={footer}>{footer}</Footer>,
        ]}
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
