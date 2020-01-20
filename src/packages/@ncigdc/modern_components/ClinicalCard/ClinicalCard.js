// @flow

import React from 'react';
import {
  branch,
  compose,
  renderComponent,
  setDisplayName,
  withState,
} from 'recompose';
import { connect } from 'react-redux';
import Card from '@ncigdc/uikit/Card';
import Tabs from '@ncigdc/uikit/Tabs';
import SideTabs from '@ncigdc/uikit/SideTabs';
import { withTheme } from '@ncigdc/theme';
import { Row } from '@ncigdc/uikit/Flex/';
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import ageDisplay from '@ncigdc/utils/ageDisplay';
import formatFileSize from '@ncigdc/utils/formatFileSize';
import { truncate } from 'lodash/string';
import { visualizingButton } from '@ncigdc/theme/mixins';
import timestamp from '@ncigdc/utils/timestamp';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import AddToCartButtonSingle from '@ncigdc/components/AddToCartButtonSingle';
import DownloadFile from '@ncigdc/components/DownloadFile';
import DownloadClinicalDropdown from '@ncigdc/modern_components/DownloadClinicalDropdown/';
import { makeFilter } from '@ncigdc/utils/filters';

const styles = {
  common: theme => ({
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
    backgroundColor: 'transparent',
    color: theme.greyScale2,
    justifyContent: 'flex-start',
  }),
  downloadButton: theme => ({
    ...styles.common(theme),
    border: `1px solid ${theme.greyScale4}`,
    padding: '3px 5px',
  }),
  molecularTestTh: {
    whiteSpace: 'normal',
  },
  tabTitle: { margin: 0 },
};

export default compose(
  setDisplayName('EnhancedClinicalCard'),
  branch(
    ({ viewer }) => !viewer.repository.cases.hits.edges[0],
    renderComponent(() => <div>No case found.</div>),
  ),
  connect(state => state.cart),
  withState('activeTab', 'setTab', 0),
  withState('state', 'setState', {
    jsonDownloading: false,
    tsvDownloading: false,
  }),
  withTheme,
)(
  ({
    activeTab,
    setTab,
    theme,
    viewer: { repository: { cases: { hits: { edges } } } },
  }) => {
    const {
      case_id: caseId,
      submitter_id: submitterId,
      diagnoses: { hits: { edges: diagnoses = [] } },
      family_histories: { hits: { edges: familyHistories = [] } },
      demographic = {},
      exposures: { hits: { edges: exposures = [], total: totalExposures } },
      follow_ups: { hits: { edges: followUps = [] } },
      files: { hits: { edges: clinicalFiles = [] } },
      project: { project_id: projectId = {} },
    } = edges[0].node;
    const familyHistory = familyHistories.map(history => history.node);

    const caseFilter = makeFilter([
      {
        field: 'cases.case_id',
        value: [caseId],
      },
    ]);

    return (
      <Card
        className="test-clinical-card"
        style={{ flex: 1 }}
        title={(
          <Row style={{ justifyContent: 'space-between' }}>
            <span>Clinical</span>
            <DownloadClinicalDropdown
              buttonStyles={visualizingButton}
              filters={caseFilter}
              inactiveText="Download"
              jsonFilename={`clinical.case-${submitterId}-${projectId}.${timestamp()}.json`}
              tsvFilename={`clinical.case-${submitterId}-${projectId}.${timestamp()}.tar.gz`}
              />
          </Row>
        )}
        >
        <Tabs
          activeIndex={activeTab}
          contentStyle={{ border: 'none' }}
          onTabClick={i => setTab(() => i)}
          tabs={[
            <p key="Demographic" style={styles.tabTitle}>Demographic</p>,
            <p key="Diagnoses / Treatment" style={styles.tabTitle}>
              {`Diagnoses / Treatments (${diagnoses.length})`}
            </p>,
            <p key="Family Histories" style={styles.tabTitle}>
              {`Family Histories (${familyHistory.length})`}
            </p>,
            <p key="Exposures" style={styles.tabTitle}>
              {`Exposures (${totalExposures})`}
            </p>,
            <p key="FollowUps" style={styles.tabTitle}>
              {`Follow-Ups (${followUps.length})`}
            </p>,
          ]}
          tabStyle={{
            padding: '1rem 1.2rem',
            whiteSpace: 'nowrap',
          }}
          >
          {activeTab === 0 && (
            <div>
              {!!demographic.demographic_id && (
                <EntityPageVerticalTable
                  style={{ flex: '1 1 auto' }}
                  thToTd={[
                    {
                      td: demographic.demographic_id,
                      th: 'UUID',
                    },
                    {
                      td: demographic.ethnicity,
                      th: 'Ethnicity',
                    },
                    {
                      td: demographic.gender,
                      th: 'Gender',
                    },
                    {
                      td: demographic.race,
                      th: 'Race',
                    },
                    {
                      td: demographic.days_to_birth,
                      th: 'Days to Birth',
                    },
                    {
                      td: demographic.days_to_death,
                      th: 'Days to Death',
                    },
                    {
                      td: demographic.vital_status,
                      th: 'Vital Status',
                    },
                  ]}
                  />
              )}
              {!demographic.demographic_id && (
                <h3 style={{ paddingLeft: '2rem' }}>No Demographic Found.</h3>
              )}
            </div>
          )}
          {activeTab === 1 && (
            <div>
              {!!diagnoses.length && (
                <SideTabs
                  containerStyle={{ display: 'block' }}
                  contentStyle={{ border: 'none' }}
                  tabContent={diagnoses.map(({ node: x }) => (
                    <span key={x.diagnosis_id}>
                      <EntityPageVerticalTable
                        style={{ flex: 1 }}
                        thToTd={[
                          {
                            td: x.diagnosis_id,
                            th: 'UUID',
                          },
                          {
                            td: x.classification_of_tumor,
                            th: 'Classification of Tumor',
                          },
                          {
                            td: x.alcohol_intensity,
                            th: 'Alcohol Intensity',
                          },
                          {
                            td: ageDisplay(x.age_at_diagnosis),
                            th: 'Age at Diagnosis',
                          },
                          {
                            td: x.days_to_last_follow_up,
                            th: 'Days to Last Follow Up',
                          },
                          {
                            td: x.days_to_last_known_disease_status,
                            th: 'Days to Last Known Disease Status',
                          },
                          {
                            td: x.days_to_recurrence,
                            th: 'Days to Recurrence',
                          },
                          {
                            td: x.last_known_disease_status,
                            th: 'Last Known Disease Status',
                          },
                          {
                            td: x.morphology,
                            th: 'Morphology',
                          },
                          {
                            td: x.primary_diagnosis,
                            th: 'Primary Diagnosis',
                          },
                          {
                            td: x.prior_malignancy,
                            th: 'Prior Malignancy',
                          },
                          {
                            td: x.synchronous_malignancy,
                            th: 'Synchronous Malignancy',
                          },
                          {
                            td: x.progression_or_recurrence,
                            th: 'Progression or Recurrence',
                          },
                          {
                            td: x.site_of_resection_or_biopsy,
                            th: 'Site of Resection of Biopsy',
                          },
                          {
                            td: x.tissue_or_organ_of_origin,
                            th: 'Tissue or Organ of Origin',
                          },
                          {
                            td: x.tumor_grade,
                            th: 'Tumor Grade',
                          },
                          {
                            td: x.tumor_stage,
                            th: 'Tumor Stage',
                          },
                        ]}
                        />
                      <div
                        style={{
                          color: theme.greyScale7,
                          fontSize: '2rem',
                          lineHeight: '1.4em',
                          padding: '1rem',
                        }}
                        >
                        Treatments (
                        {x.treatments ? x.treatments.hits.edges.length : 0}
                        )
                      </div>
                      {x.treatments &&
                        !!x.treatments.hits.edges.length && (
                          <EntityPageHorizontalTable
                            data={x.treatments.hits.edges.map(({ node }) => ({
                              daysToTreatmentStart: node.days_to_treatment_start,
                              therapeuticAgents: node.therapeutic_agents,
                              treatmentId: node.treatment_id,
                              treatmentIntentType: node.treatment_intent_type,
                              treatmentOrTherapy: node.treatment_or_therapy,
                            }))
                            }
                            headings={[
                              {
                                key: 'treatmentId',
                                title: 'UUID',
                              },
                              {
                                key: 'therapeuticAgents',
                                title: 'Therapeutic Agents',
                              },
                              {
                                key: 'treatmentIntentType',
                                title: 'Treatment Intent Type',
                              },
                              {
                                key: 'treatmentOrTherapy',
                                title: 'Treatment or Therapy',
                              },
                              {
                                key: 'daysToTreatmentStart',
                                style: { textAlign: 'right' },
                                title: 'Days to Treatment Start',
                              },
                            ]}
                            />
                      )}
                      {(!x.treatments || !x.treatments.hits.edges.length) && (
                      <div style={{ paddingLeft: '2rem' }}>
                            No Treatments Found.
                      </div>
                      )}
                    </span>
                  ))}
                  tabs={
                    diagnoses.length > 1
                      ? diagnoses.map(x => (
                        <p key={x.node.diagnosis_id}>
                          {truncate(x.node.diagnosis_id, { length: 11 })}
                        </p>
                      ))
                      : []
                  }
                  />
              )}
              {!diagnoses.length && (
                <h3 style={{ paddingLeft: '2rem' }}>No Diagnoses Found.</h3>
              )}
            </div>
          )}
          {activeTab === 2 && (
            <div>
              {!!familyHistory.length && (
                <SideTabs
                  containerStyle={{ display: 'block' }}
                  contentStyle={{ border: 'none' }}
                  tabContent={familyHistory.map(x => (
                    <EntityPageVerticalTable
                      key={x.family_history_id}
                      thToTd={[
                        {
                          td: x.family_history_id,
                          th: 'UUID',
                        },
                        {
                          td: x.relationship_age_at_diagnosis,
                          th: 'Relationship Age at Diagnosis',
                        },
                        {
                          td: x.relationship_gender,
                          th: 'Relationship Gender',
                        },
                        {
                          td: x.relationship_primary_diagnosis,
                          th: 'Relationship Primary Diagnosis',
                        },
                        {
                          td: x.relationship_type,
                          th: 'Relationship Type',
                        },
                        {
                          td: x.relative_with_cancer_history,
                          th: 'Relative with Cancer History',
                        },
                      ]}
                      />
                  ))}
                  tabs={
                    familyHistory.length > 1
                      ? familyHistory.map(x => (
                        <p key={x.family_history_id}>
                          {truncate(x.family_history_id, { length: 11 })}
                        </p>
                      ))
                      : []
                  }
                  />
              )}
              {!familyHistory.length && (
                <h3 style={{ paddingLeft: '2rem' }}>
                  No Family Histories Found.
                </h3>
              )}
            </div>
          )}
          {activeTab === 3 && (
            <div>
              {!!totalExposures && (
                <SideTabs
                  containerStyle={{ display: 'block' }}
                  contentStyle={{ border: 'none' }}
                  tabContent={exposures.map(x => (
                    <EntityPageVerticalTable
                      key={x.node.exposure_id}
                      thToTd={[
                        {
                          td: x.node.exposure_id,
                          th: 'UUID',
                        },
                        {
                          td: x.node.alcohol_history,
                          th: 'Alcohol History',
                        },
                        {
                          td: x.node.height,
                          th: 'Height',
                        },
                        {
                          td: x.node.weight,
                          th: 'Weight',
                        },
                        {
                          td: x.node.tobacco_smoking_status,
                          th: 'Tobacco Smoking Status',
                        },
                        {
                          td: x.node.years_smoked,
                          th: 'Years Smoked',
                        },
                        {
                          td: x.node.pack_years_smoked,
                          th: 'Pack Years Smoked',
                        },
                      ]}
                      />
                  ))}
                  tabs={
                    exposures.length > 1
                      ? exposures.map(x => (
                        <p key={x.node.exposure_id}>
                          {truncate(x.node.exposure_id, { length: 11 })}
                        </p>
                      ))
                      : []
                  }
                  />
              )}
              {!totalExposures && (
                <h3 style={{ paddingLeft: '2rem' }}>No Exposures Found.</h3>
              )}
            </div>
          )}
          {activeTab === 4 && (
          <div>
            {followUps.length > 0 && (
            <SideTabs
                containerStyle={{
                  display: 'block',
                }}
                contentStyle={{ border: 'none' }}
                tabContainerStyle={{
                  maxHeight: 900,
                  minWidth: 90,
                }}
                tabContent={followUps.map(followUp => (
                  <React.Fragment key={followUp.node.follow_up_id}>
                    <EntityPageVerticalTable
                      thToTd={[
                        {
                          td: followUp.node.follow_up_id,
                          th: 'UUID',
                        },
                        {
                          td: followUp.node.days_to_follow_up,
                          th: 'Days to Follow Up',
                        },
                        {
                          td: followUp.node.comorbidity,
                          th: 'Comorbidity',
                        },
                        {
                          td: followUp.node.risk_factor,
                          th: 'Risk Factor',
                        },
                        {
                          td: followUp.node.progression_or_recurrence_type,
                          th: 'Progression or Recurrence Type',
                        },
                        {
                          td: followUp.node.progression_or_recurrence,
                          th: 'Progression or Recurrence',
                        },
                        {
                          td: followUp.node.disease_response,
                          th: 'Disease Response',
                        },
                        {
                          td: followUp.node.bmi,
                          th: 'BMI',
                        },
                        {
                          td: followUp.node.height,
                          th: 'Height',
                        },
                        {
                          td: followUp.node.weight,
                          th: 'Weight',
                        },
                        {
                          td: followUp.node.ecog_performance_status,
                          th: 'Ecog Performance Status',
                        },
                        {
                          td: followUp.node.karnofsky_performance_status,
                          th: 'Karnofsky Performance Status',
                        },
                        {
                          td: followUp.node.progression_or_recurrence_anatomic_site,
                          th: 'Progression Or Recurrence Anatomic Site',
                        },
                        {
                          td: followUp.node.reflux_treatment_type,
                          th: 'Reflux Treatment Type',
                        },
                      ]}
                      />
                    <div
                      style={{
                        color: theme.greyScale7,
                        fontSize: '2rem',
                        lineHeight: '1.4em',
                        padding: '1rem',
                      }}
                      >
                      Molecular Tests (
                      {followUp.node.molecular_tests
                        ? followUp.node.molecular_tests.hits.edges.length
                        : 0
                      }
                      )
                    </div>
                    {followUp.node.molecular_tests &&
                      followUp.node.molecular_tests.hits.edges.length > 0 && (
                        <EntityPageHorizontalTable
                          data={followUp.node.molecular_tests.hits.edges.map(({ node }) => ({
                            biospecimenType: node.biospecimen_type,
                            geneSymbol: node.gene_symbol,
                            laboratoryTest: node.laboratory_test,
                            molecularAnalysisMethod: node.molecular_analysis_method,
                            molecularTestId: node.molecular_test_id,
                            testValue: node.test_value && node.test_units ? `${node.test_value} ${node.test_units}` : node.test_value,
                          }))}
                          headings={[
                            {
                              key: 'molecularTestId',
                              title: 'UUID',
                            },
                            {
                              key: 'molecularAnalysisMethod',
                              style: styles.molecularTestTh,
                              title: 'Molecular Analysis Method',
                            },
                            {
                              key: 'geneSymbol',
                              style: styles.molecularTestTh,
                              title: 'Gene Symbol',
                            },
                            {
                              key: 'laboratoryTest',
                              style: styles.molecularTestTh,
                              title: 'Laboratory Test',
                            },
                            {
                              key: 'biospecimenType',
                              style: styles.molecularTestTh,
                              title: 'Biospecimen Type',
                            },
                            {
                              key: 'testValue',
                              title: 'Test Value',
                            },
                          ]}
                          />
                    )}
                    {!(followUp.node.molecular_tests &&
                      followUp.node.molecular_tests.hits.edges.length) && (
                      <div style={{ paddingLeft: '2rem' }}>
                      No Molecular Tests Found.
                      </div>
                    )}
                  </React.Fragment>
                ))}
                tabs={
                  followUps.length > 1
                    ? followUps.map(followUp => (
                      <p key={followUp.node.follow_up_id}>
                        {truncate(followUp.node.follow_up_id, { length: 11 })}
                      </p>
                    ))
                    : []
                }
                />
            )}
            {followUps.length === 0 && (
            <h3 style={{ paddingLeft: '2rem' }}>No Follow Ups Found.</h3>
            )}
          </div>
          )}

        </Tabs>
        {clinicalFiles.length > 0 && (
          <div
            style={{
              borderTop: `1px solid ${theme.greyScale5}`,
              marginTop: '10px',
              padding: '2px 10px 10px 10px',
            }}
            >
            <EntityPageHorizontalTable
              className="clinical-supplement-file-table"
              data={clinicalFiles.map((f, i) => {
                const fileData = {
                  ...f.node,
                  projects: [projectId],
                };
                return {
                  file_name: (
                    <span key="filename">
                      {f.node.access === 'open' && (
                        <i className="fa fa-unlock-alt" />
                      )}
                      {f.node.access === 'controlled' && (
                        <i className="fa fa-lock" />
                      )}
                      {' '}
                      {f.node.file_name}
                    </span>
                  ),
                  data_format: f.node.data_format,
                  file_size: formatFileSize(f.node.file_size),
                  action: (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                      >
                      <span key="add_to_cart" style={{ paddingRight: '10px' }}>
                        <AddToCartButtonSingle file={fileData} />
                      </span>
                      <span style={{ paddingRight: '10px' }}>
                        <DownloadFile
                          activeText=""
                          file={f.node}
                          inactiveText=""
                          style={{
                            ...styles.downloadButton(theme),
                            backgroundColor: 'white',
                          }}
                          />
                      </span>
                    </div>
                  ),
                };
              })}
              headings={[
                {
                  key: 'file_name',
                  title: 'Filename',
                },
                {
                  key: 'data_format',
                  title: 'Data format',
                },
                {
                  key: 'file_size',
                  style: { textAlign: 'right' },
                  title: 'Size',
                },
                {
                  key: 'action',
                  title: 'Action',
                },
              ]}
              title="Clinical Supplement File"
              titleStyle={{ fontSize: '1em' }}
              />
          </div>
        )}
      </Card>
    );
  },
);
