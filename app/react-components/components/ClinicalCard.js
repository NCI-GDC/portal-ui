import React from 'react';
import { withState } from 'recompose';
import Card from '../uikit/Card';
import Tabs from '../uikit/Tabs';
import theme from '../theme';
import EntityPageVerticalTable from './EntityPageVerticalTable';
import Table, { Tr, Td, Th } from '../uikit/Table';
import SideTabs from './SideTabs';

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
        contentStyle={{ border: 'none' }}
        onTabClick={i => setTab(() => i)}
        tabs={[
          <p key="Demographic">Demographic</p>,
          <p key="Diagnoses / Treatment">Diagnoses / Treatments ({(p.diagnoses || []).length})</p>,
          <p key="Family Histories">Family Histories ({(p.family_histories || []).length})</p>,
          <p key="Exposures">Exposures ({(p.exposures || []).length})</p>,
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
        {activeTab === 1 &&
          <SideTabs
            contentStyle={{ border: 'none' }}
            tabs={(p.diagnoses || []).map(x => <p key={x.diagnosis_id}>{x.diagnosis_id}</p>)}
            tabContent={(p.diagnoses || []).map(x =>
              <span key={x.diagnosis_id}>
                <EntityPageVerticalTable
                  thToTd={[
                    { th: 'ID', td: x.diagnosis_id },
                    { th: 'Classification of Tumor', td: x.classification_of_tumor },
                    { th: 'Alcohol Intensity', td: x.alcohol_intensity },
                    { th: 'Age at Diagnosis', td: x.age_at_diagnosis },
                    { th: 'Days to Birth', td: x.days_to_birth },
                    { th: 'Days to Death', td: x.days_to_death },
                    { th: 'Days to Last Follwup', td: x.days_to_last_followup },
                    {
                      th: 'Days to Last Known Disease Status',
                      td: x.days_to_last_known_disease_status,
                    },
                    { th: 'Days to Recurrence', td: x.days_to_recurrence },
                    { th: 'Last Known Disease Status', td: x.last_known_disease_status },
                    { th: 'Morphology', td: x.morphology },
                    { th: 'Primary Diagnosis', td: x.primary_diagnosis },
                    { th: 'Prior Malignancy', td: x.prior_malignancy },
                    { th: 'Progression or Recurrence', td: x.progression_or_recurrence },
                    { th: 'Site of Resection of Biopsy', td: x.site_of_resection_or_biopsy },
                    { th: 'Tissue or Organ of Origin', td: x.tissue_or_organ_of_origin },
                    { th: 'Tumor Grade', td: x.tumor_grade },
                    { th: 'Tumor Stage', td: x.tumor_stage },
                    { th: 'Vital Status', td: x.vital_status },
                  ]}
                  style={{ flex: 1 }}
                />
                <div
                  style={{
                    ...styles.cardHeader,
                    fontSize: '2rem',
                    lineHeight: '1.4em',
                  }}
                >
                  Treatments
                </div>
                {!!x.treatments.length &&
                  <Table
                    headings={[
                      <Th key="id">ID</Th>,
                      <Th key="agents">Therapeutic Agents</Th>,
                      <Th key="intent_type">Treatment Intent Type</Th>,
                      <Th key="therapy">Treatment or Therapy</Th>,
                      <Th key="days">Days to Treatment</Th>,
                    ]}
                    body={
                      <tbody>
                        {x.treatments.map(t =>
                          <Tr key={t.treatment_id}>
                            <Td>{t.treatment_id || '--'}</Td>
                            <Td>{t.therapeutic_agents || '--'}</Td>
                            <Td>{t.treatment_intent_type || '--'}</Td>
                            <Td>{t.treatment_or_therapy || '--'}</Td>
                            <Td>{t.days_to_treatment || '--'}</Td>
                          </Tr>
                        )}
                      </tbody>
                    }
                  />
                }
                {!x.treatments.length &&
                  <div>No treatments found.</div>
                }
              </span>
            )}
          />
        }
        {activeTab === 2 &&
          <SideTabs
            contentStyle={{ border: 'none' }}
            tabs={
              (p.family_histories || []).map(x =>
                <p key={x.family_history_id}>{x.family_history_id}</p>
              )
            }
            tabContent={(p.family_histories || []).map(x =>
              <EntityPageVerticalTable
                key={x.family_history_id}
                thToTd={[
                  { th: 'ID', td: x.family_history_id },
                  { th: 'Relationship Age at Diagnosis', td: x.relationship_age_at_diagnosis },
                  { th: 'Relationship Gender', td: x.relationship_gender },
                  { th: 'Relationship Primary Diagnosis', td: x.relationship_primary_diagnosis },
                  { th: 'Relationship Type', td: x.relationship_type },
                  { th: 'Relative with Cancer History', td: x.relative_with_cancer_history },
                ]}
              />
            )}
          />
        }
        {activeTab === 3 &&
          <SideTabs
            contentStyle={{ border: 'none' }}
            tabs={
              (p.exposures || []).map(x =>
                <p key={x.exposure_id}>{x.exposure_id}</p>
              )
            }
            tabContent={(p.exposures || []).map(x =>
              <EntityPageVerticalTable
                key={x.exposure_id}
                thToTd={[
                  { th: 'ID', td: x.exposure_id },
                  { th: 'Alcohol History', td: x.alcohol_history },
                  { th: 'Alcohol Intensity', td: x.alcohol_intensity },
                  { th: 'BMI', td: x.bmi },
                  { th: 'Cigarettes per Day', td: x.cigarettes_per_day },
                  { th: 'Height', td: x.height },
                  { th: 'Weight', td: x.weight },
                  { th: 'Years Smoked', td: x.years_smoked },
                ]}
              />
            )}
          />
        }
      </Tabs>
    </Card>
  );
};

export default withState('activeTab', 'setTab', 0)(ClinicalCard);
