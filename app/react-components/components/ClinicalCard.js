import React from 'react';
import { withState } from 'recompose';
import Card from '../uikit/Card';
import Tabs from '../uikit/Tabs';
import theme from '../theme';
import EntityPageVerticalTable from './EntityPageVerticalTable';

let styles = {
  cardHeader: {
    padding: '1rem',
    color: theme.greyScale7,
  },
};

let ClinicalCard = ({ p, activeTab, setTab }) => {
  return (
    <Card title="Clinical" headerStyle={styles.cardHeader} style={{ flex: 1 }}>
      <Tabs
        onTabClick={i => setTab(() => i)}
        tabs={[
          <p key="Demographic">Demographic</p>,
          <p key="Diagnoses / Treatment">Diagnoses / Treatment {(p.diagnoses || []).length}</p>,
          <p key="Family Histories">Family Histories</p>,
          <p key="Exposures">Exposures</p>,
        ]}
        activeIndex={activeTab}
      >
        {activeTab === 0 &&
          <EntityPageVerticalTable
            thToTd={[
              { th: 'ID', td: p.demographic.demographic_id },
              { th: 'Ethnicity', td: p.demographic.ethnicity },
              { th: 'Gender', td: p.demographic.gender },
              { th: 'Race', td: p.demographic.race },
              { th: 'Year of Birth', td: p.demographic.year_of_birth },
              { th: 'Year of Death', td: p.demographic.year_of_death },
            ]}
            style={{ flex: 1 }}
          />
        }
      </Tabs>
    </Card>
  );
};

export default withState('activeTab', 'setTab', 0)(ClinicalCard);
