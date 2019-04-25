// @flow

import React from 'react';
import {
  compose, withState, branch, renderComponent,
} from 'recompose';
import { connect } from 'react-redux';
import Card from '@ncigdc/uikit/Card';
import Tabs from '@ncigdc/uikit/Tabs';
import SideTabs from '@ncigdc/uikit/SideTabs';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
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
    backgroundColor: 'transparent',
    color: theme.greyScale2,
    justifyContent: 'flex-start',
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  }),
  downloadButton: theme => ({
    ...styles.common(theme),
    padding: '3px 5px',
    border: `1px solid ${theme.greyScale4}`,
  }),
};

export default compose(
  branch(
    ({ viewer }) => !viewer.repository.cases.hits.edges[0],
    renderComponent(() => <div>No case found.</div>)
  ),
  connect(state => state.cart),
  withState('activeTab', 'setTab', 0),
  withState('state', 'setState', {
    tsvDownloading: false,
    jsonDownloading: false,
  }),
  withTheme
)(
  ({
    activeTab,
    setTab,
    theme,
    viewer: { repository: { cases: { hits: { edges } } } },
    dropdownStyle,
    active,
    state,
    setState,
    requests,
  }) => {
    const {
      case_id: caseId,
      submitter_id: submitterId,
      diagnoses: { hits: { edges: diagnoses = [] } },
      family_histories: { hits: { edges: familyHistories = [] } },
      demographic = {},
      exposures: { hits: { edges: exposures = [], total: totalExposures } },
      files: { hits: { edges: clinicalFiles = [] } },
      project: { project_id: projectId = {} },
    } = edges[0].node;
    const familyHistory = familyHistories.map(x => x.node);
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
              tsvFilename={`clinical.case-${submitterId}-${projectId}.${timestamp()}.tar.gz`} />
          </Row>
        )}>
        <Tabs
          activeIndex={activeTab}
          contentStyle={{ border: 'none' }}
          onTabClick={i => setTab(() => i)}
          tabs={[
            <p key="Demographic">Demographic</p>,
            <p key="Diagnoses / Treatment">
              Diagnoses / Treatments (
              {diagnoses.length}
)
            </p>,
            <p key="Family Histories">
              Family Histories (
              {familyHistory.length}
)
            </p>,
            <p key="Exposures">
Exposures (
              {totalExposures}
)
            </p>,
          ]}>
          {activeTab === 0 && (
            <div>
              {!!demographic.demographic_id && (
                <EntityPageVerticalTable
                  style={{ flex: '1 1 auto' }}
                  thToTd={[
                    {
                      th: 'UUID',
                      td: demographic.demographic_id,
                    },
                    {
                      th: 'Ethnicity',
                      td: demographic.ethnicity,
                    },
                    {
                      th: 'Gender',
                      td: demographic.gender,
                    },
                    {
                      th: 'Race',
                      td: demographic.race,
                    },
                    {
                      th: 'Year of Birth',
                      td: demographic.year_of_birth,
                    },
                    {
                      th: 'Year of Death',
                      td: demographic.year_of_death,
                    },
                  ]} />
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
                  tabContent={diagnoses.map(d => d.node).map(x => (
                    <span key={x.diagnosis_id}>
                      <EntityPageVerticalTable
                        style={{ flex: 1 }}
                        thToTd={[
                          {
                            th: 'UUID',
                            td: x.diagnosis_id,
                          },
                          {
                            th: 'Classification of Tumor',
                            td: x.classification_of_tumor,
                          },
                          {
                            th: 'Alcohol Intensity',
                            td: x.alcohol_intensity,
                          },
                          {
                            th: 'Age at Diagnosis',
                            td: ageDisplay(x.age_at_diagnosis),
                          },
                          {
                            th: 'Days to Birth',
                            td: x.days_to_birth,
                          },
                          {
                            th: 'Days to Death',
                            td: x.days_to_death,
                          },
                          {
                            th: 'Days to Last Follow Up',
                            td: x.days_to_last_follow_up,
                          },
                          {
                            th: 'Days to Last Known Disease Status',
                            td: x.days_to_last_known_disease_status,
                          },
                          {
                            th: 'Days to Recurrence',
                            td: x.days_to_recurrence,
                          },
                          {
                            th: 'Last Known Disease Status',
                            td: x.last_known_disease_status,
                          },
                          {
                            th: 'Morphology',
                            td: x.morphology,
                          },
                          {
                            th: 'Primary Diagnosis',
                            td: x.primary_diagnosis,
                          },
                          {
                            th: 'Prior Malignancy',
                            td: x.prior_malignancy,
                          },
                          {
                            th: 'Progression or Recurrence',
                            td: x.progression_or_recurrence,
                          },
                          {
                            th: 'Site of Resection of Biopsy',
                            td: x.site_of_resection_or_biopsy,
                          },
                          {
                            th: 'Tissue or Organ of Origin',
                            td: x.tissue_or_organ_of_origin,
                          },
                          {
                            th: 'Tumor Grade',
                            td: x.tumor_grade,
                          },
                          {
                            th: 'Tumor Stage',
                            td: x.tumor_stage,
                          },
                          {
                            th: 'Vital Status',
                            td: x.vital_status,
                          },
                        ]} />
                      <div
                        style={{
                          padding: '1rem',
                          color: theme.greyScale7,
                          fontSize: '2rem',
                          lineHeight: '1.4em',
                        }}>
                        Treatments (
                        {x.treatments ? x.treatments.hits.edges.length : 0}
                        )
                      </div>
                      {x.treatments &&
                        !!x.treatments.hits.edges.length && (
                        <Table
                          body={(
                            <tbody>
                              {x.treatments.hits.edges.map(({ node }) => (
                                <Tr key={node.treatment_id}>
                                  <Td>{node.treatment_id || '--'}</Td>
                                  <Td>{node.therapeutic_agents || '--'}</Td>
                                  <Td>
                                    {node.treatment_intent_type || '--'}
                                  </Td>
                                  <Td>{node.treatment_or_therapy || '--'}</Td>
                                  <Td>
                                    {node.days_to_treatment_start || '--'}
                                  </Td>
                                </Tr>
                              ))}
                            </tbody>
                          )}
                          headings={[
                            <Th key="id">UUID</Th>,
                            <Th key="agents">Therapeutic Agents</Th>,
                            <Th key="intent_type">Treatment Intent Type</Th>,
                            <Th key="therapy">Treatment or Therapy</Th>,
                            <Th key="days">Days to Treatment Start</Th>,
                          ]} />
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
                  } />
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
                          th: 'UUID',
                          td: x.family_history_id,
                        },
                        {
                          th: 'Relationship Age at Diagnosis',
                          td: x.relationship_age_at_diagnosis,
                        },
                        {
                          th: 'Relationship Gender',
                          td: x.relationship_gender,
                        },
                        {
                          th: 'Relationship Primary Diagnosis',
                          td: x.relationship_primary_diagnosis,
                        },
                        {
                          th: 'Relationship Type',
                          td: x.relationship_type,
                        },
                        {
                          th: 'Relative with Cancer History',
                          td: x.relative_with_cancer_history,
                        },
                      ]} />
                  ))}
                  tabs={
                    familyHistory.length > 1
                      ? familyHistory.map(x => (
                        <p key={x.family_history_id}>
                          {truncate(x.family_history_id, { length: 11 })}
                        </p>
                      ))
                      : []
                  } />
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
                          th: 'UUID',
                          td: x.node.exposure_id,
                        },
                        {
                          th: 'Alcohol History',
                          td: x.node.alcohol_history,
                        },
                        {
                          th: 'BMI',
                          td: x.node.bmi,
                        },
                        {
                          th: 'Cigarettes per Day',
                          td: x.node.cigarettes_per_day,
                        },
                        {
                          th: 'Height',
                          td: x.node.height,
                        },
                        {
                          th: 'Weight',
                          td: x.node.weight,
                        },
                        {
                          th: 'Years Smoked',
                          td: x.node.years_smoked,
                        },
                      ]} />
                  ))}
                  tabs={
                    exposures.length > 1
                      ? exposures.map(x => (
                        <p key={x.node.exposure_id}>
                          {truncate(x.node.exposure_id, { length: 11 })}
                        </p>
                      ))
                      : []
                  } />
              )}
              {!totalExposures && (
                <h3 style={{ paddingLeft: '2rem' }}>No Exposures Found.</h3>
              )}
            </div>
          )}
        </Tabs>
        {clinicalFiles.length > 0 && (
          <div
            style={{
              padding: '2px 10px 10px 10px',
              borderTop: `1px solid ${theme.greyScale5}`,
              marginTop: '10px',
            }}>
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
                      }}>
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
                          }} />
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
                  title: 'Size',
                  style: { textAlign: 'right' },
                },
                {
                  key: 'action',
                  title: 'Action',
                },
              ]}
              title="Clinical Supplement File"
              titleStyle={{ fontSize: '1em' }} />
          </div>
        )}
      </Card>
    );
  }
);
