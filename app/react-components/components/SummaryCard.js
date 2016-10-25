// Vendor
import React, { PropTypes } from 'react';
import { compose, withState } from 'recompose';

// Custom
import PieChart from './PieChart';
import { Row, Column } from '../uikit/Flex';
import Card from '../uikit/Card';
import theme from '../theme';
import { center } from '../theme/mixins';
import EntityPageHorizontalTable from './EntityPageHorizontalTable';

/*----------------------------------------------------------------------------*/

const styles = {
  header: {
    padding: '1rem',
    borderBottom: `1px solid ${theme.greyScale4}`,
    color: theme.primary,
  },
  footer: {
    padding: '1rem',
    borderTop: `1px solid ${theme.greyScale4}`,
    ...center,
  },
};

const SummaryCard = ({
  data,
  title,
  pieChartTitle,
  tableTitle,
  style,
  footer,
  path,
  showTable,
  setShowTable,
  headings,
}) => (
  <Card style={style}>
    <Column>
      <Row style={styles.header}>
        <span style={{ flexGrow: 1 }}>{(showTable ? tableTitle : pieChartTitle) || title}</span>
        <span onClick={() => setShowTable(!showTable)}>
          <i style={{ color: '#000' }} className={`fa ${showTable ? 'fa-pie-chart' : 'fa-table'}`} />
        </span>
      </Row>

      { showTable &&
        <EntityPageHorizontalTable
          headings={headings}
          data={data}
          style={{ overflow: 'hidden', borderLeft: 0, borderTop: 0 }}
        />
      }
      {!showTable &&
        [
          <PieChart key="chart" data={data} path={path} height={250} width={250} />,
          footer && <Row key={footer} style={styles.footer}>{footer}</Row>,
        ]
      }
    </Column>
  </Card>
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

const enhance = compose(
  withState('showTable', 'setShowTable', true),
);

export default enhance(SummaryCard);
