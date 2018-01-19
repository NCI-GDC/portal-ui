// @flow

import React from 'react';
import { compose, withState, branch, renderComponent } from 'recompose';
import Card from '@ncigdc/uikit/Card';
import Tabs from '@ncigdc/uikit/Tabs';
import SideTabs from '@ncigdc/uikit/SideTabs';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
import { withTheme, theme } from '@ncigdc/theme';
import { Row, Column } from '@ncigdc/uikit/Flex/';
import DownloadButton from '@ncigdc/components/DownloadButton';
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import ageDisplay from '@ncigdc/utils/ageDisplay';
import { truncate } from 'lodash/string';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DownloadIcon from '@ncigdc/theme/icons/Download';
import { visualizingButton } from '@ncigdc/theme/mixins';
import Spinner from '@ncigdc/theme/icons/Spinner';
import Button from '@ncigdc/uikit/Button';
import moment from 'moment';

const styles = {
  dropdownContainer: {
    top: '100%',
    whiteSpace: 'nowrap',
    marginTop: '2px',
    minWidth: '100px',
  },
  icon: {
    marginRight: '1em',
  },
  dropdownItem: {
    color: theme.greyScale3,
    ':hover': {
      color: theme.greyScale3,
      background: theme.greyScale6,
    },
    display: 'flex',
    alignItems: 'center',
  },
  common: theme => ({
    backgroundColor: 'transparent',
    color: theme.greyScale2,
    justifyContent: 'flex-start',
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  }),
  button: theme => ({
    borderRadius: '0px',
    marginLeft: '0px',
    ...styles.common(theme),
    '[disabled]': styles.common(theme),
  }),
  iconSpacing: {
    marginRight: '0.6rem',
  },
};

export default compose(
  branch(
    ({ viewer }) => !viewer.repository.cases.hits.edges[0],
    renderComponent(() => <div>No case found.</div>),
  ),
  withState('activeTab', 'setTab', 0),
  withState('state', 'setState', {
    tsvDownloading: false,
    jsonDownloading: false,
  }),
  withTheme,
  // withProps(
  //   ({ requests, viewer: { repository: { cases: { hits: { edges } } } } }) => {
  //     const {
  //       case_id: caseId,
  //       diagnoses: { hits: { edges: diagnoses = [] } },
  //       family_histories: { hits: { edges: familyHistory = [] } },
  //       demographic = {},
  //       exposures: { hits: { edges: exposures = [] } },
  //     } = edges[0].node;
  //
  //     const buildRequest = (filename, fields) => ({
  //       endpoint: '/cases',
  //       filename,
  //       params: {
  //         filters: {
  //           op: 'and',
  //           content: [
  //             {
  //               op: 'in',
  //               content: {
  //                 field: 'cases.case_id',
  //                 value: [caseId],
  //               },
  //             },
  //           ],
  //         },
  //         fields: fields.join(),
  //       },
  //     });
  //     let validRequests = [];
  //     if (!!demographic || (diagnoses[0] && diagnoses[0].node.length)) {
  //       validRequests = [
  //         ...validRequests,
  //         buildRequest('case_clinical.tsv', DEMOGRAPHIC_AND_DIAGNOSES_FIELDS),
  //       ];
  //     }
  //     if (familyHistory && familyHistory.length) {
  //       validRequests = [
  //         ...validRequests,
  //         buildRequest('family_history.tsv', FAMILY_HISTORIES_FIELDS),
  //       ];
  //     }
  //     if (exposures && exposures.length) {
  //       validRequests = [
  //         ...validRequests,
  //         buildRequest('exposure.tsv', EXPOSURES_FIELDS),
  //       ];
  //     }
  //     return {
  //       requests: validRequests,
  //     };
  //   },
  // ),
)(
  ({
    activeTab,
    setTab,
    theme,
    viewer: { repository: { cases: { hits: { edges } } } },
    isLoading,
    dropdownStyle,
    active,
    state,
    setState,
    requests,
  }) => {
    const {
      case_id: caseId,
      diagnoses: { hits: { edges: diagnoses = [] } },
      family_histories: { hits: { edges: familyHistory = [] } },
      demographic = {},
      exposures: { hits: { edges: exposures = [], total: totalExposures } },
    } = edges[0].node;
    return (
      <Card
        className="test-clinical-card"
        style={{ flex: 1 }}
        title={
          <Row style={{ justifyContent: 'space-between' }}>
            <span>Clinical</span>
            <Dropdown
              button={
                <Button
                  style={visualizingButton}
                  leftIcon={isLoading ? <Spinner /> : <DownloadIcon />}
                >
                  {state.jsonDownloading || state.tsvDownloading
                    ? 'Processing'
                    : 'Export'}
                </Button>
              }
              dropdownStyle={styles.dropdownContainer}
            >
              <Column>
                <DownloadButton
                  className="data-download-clinical-tsv"
                  style={styles.button(theme)}
                  endpoint="/clinical_tar"
                  format={'TSV'}
                  activeText="Processing"
                  inactiveText="TSV"
                  altMessage={false}
                  setParentState={currentState =>
                    setState(s => ({
                      ...s,
                      tsvDownloading: currentState,
                    }))}
                  active={state.tsvDownloading}
                  filters={{
                    op: 'and',
                    content: [
                      {
                        op: 'in',
                        content: {
                          field: 'cases.case_id',
                          value: [caseId],
                        },
                      },
                    ],
                  }}
                  filename={`clinical.case-${caseId}_${moment().format(
                    'YYYY-MM-DD',
                  )}.tar.gz`}
                  // extraParams={{
                  //   ids: files.map(file => file.file_id),
                  // }}
                />
              </Column>
              <Column>
                <DownloadButton
                  className="data-download-clinical-json"
                  style={styles.button(theme)}
                  endpoint="/cases"
                  activeText="Processing"
                  inactiveText="JSON"
                  altMessage={false}
                  setParentState={currentState =>
                    setState(s => ({
                      ...s,
                      jsonDownloading: currentState,
                    }))}
                  active={state.jsonDownloading}
                  filters={{
                    op: 'and',
                    content: [
                      {
                        op: 'in',
                        content: {
                          field: 'cases.case_id',
                          value: [caseId],
                        },
                      },
                    ],
                  }}
                  fields={['case_id']}
                  dataExportExpands={[
                    'demographic',
                    'diagnoses',
                    'diagnoses.treatments',
                    'family_histories',
                    'exposures',
                  ]}
                  filename={`clinical.case-${caseId}_${moment().format(
                    'YYYY-MM-DD',
                  )}.json`}
                  // extraParams={{
                  //   ids: files.map(file => file.file_id),
                  // }}
                />
              </Column>
            </Dropdown>
          </Row>
        }
      >
        <Tabs
          contentStyle={{ border: 'none' }}
          onTabClick={i => setTab(() => i)}
          tabs={[
            <p key="Demographic">Demographic</p>,
            <p key="Diagnoses / Treatment">
              Diagnoses / Treatments ({diagnoses.length})
            </p>,
            <p key="Family Histories">
              Family Histories ({familyHistory.length})
            </p>,
            <p key="Exposures">Exposures ({totalExposures})</p>,
          ]}
          activeIndex={activeTab}
        >
          {activeTab === 0 && (
            <div>
              {!!demographic.demographic_id && (
                <EntityPageVerticalTable
                  thToTd={[
                    { th: 'UUID', td: demographic.demographic_id },
                    { th: 'Ethnicity', td: demographic.ethnicity },
                    { th: 'Gender', td: demographic.gender },
                    { th: 'Race', td: demographic.race },
                    { th: 'Year of Birth', td: demographic.year_of_birth },
                    { th: 'Year of Death', td: demographic.year_of_death },
                  ]}
                  style={{ flex: '1 1 auto' }}
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
                  contentStyle={{ border: 'none' }}
                  containerStyle={{ display: 'block' }}
                  tabs={
                    diagnoses.length > 1
                      ? diagnoses.map(x => (
                          <p key={x.node.diagnosis_id}>
                            {truncate(x.node.diagnosis_id, { length: 11 })}
                          </p>
                        ))
                      : null
                  }
                  tabContent={diagnoses.map(d => d.node).map(x => (
                    <span key={x.diagnosis_id}>
                      <EntityPageVerticalTable
                        thToTd={[
                          { th: 'UUID', td: x.diagnosis_id },
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
                          { th: 'Days to Birth', td: x.days_to_birth },
                          { th: 'Days to Death', td: x.days_to_death },
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
                          { th: 'Morphology', td: x.morphology },
                          {
                            th: 'Primary Diagnosis',
                            td: x.primary_diagnosis,
                          },
                          { th: 'Prior Malignancy', td: x.prior_malignancy },
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
                          { th: 'Tumor Grade', td: x.tumor_grade },
                          { th: 'Tumor Stage', td: x.tumor_stage },
                          { th: 'Vital Status', td: x.vital_status },
                        ]}
                        style={{ flex: 1 }}
                      />
                      <div
                        style={{
                          padding: '1rem',
                          color: theme.greyScale7,
                          fontSize: '2rem',
                          lineHeight: '1.4em',
                        }}
                      >
                        Treatments (
                        {x.treatments ? x.treatments.hits.edges.length : 0}
                        )
                      </div>
                      {x.treatments &&
                        !!x.treatments.hits.edges.length && (
                          <Table
                            headings={[
                              <Th key="id">UUID</Th>,
                              <Th key="agents">Therapeutic Agents</Th>,
                              <Th key="intent_type">Treatment Intent Type</Th>,
                              <Th key="therapy">Treatment or Therapy</Th>,
                              <Th key="days">Days to Treatment</Th>,
                            ]}
                            body={
                              <tbody>
                                {x.treatments.hits.edges.map(({ node }) => (
                                  <Tr key={node.treatment_id}>
                                    <Td>{node.treatment_id || '--'}</Td>
                                    <Td>{node.therapeutic_agents || '--'}</Td>
                                    <Td>
                                      {node.treatment_intent_type || '--'}
                                    </Td>
                                    <Td>{node.treatment_or_therapy || '--'}</Td>
                                    <Td>{node.days_to_treatment || '--'}</Td>
                                  </Tr>
                                ))}
                              </tbody>
                            }
                          />
                        )}
                      {(!x.treatments || !x.treatments.hits.edges.length) && (
                          <div style={{ paddingLeft: '2rem' }}>
                            No Treatments Found.
                          </div>
                        )}
                    </span>
                  ))}
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
                  contentStyle={{ border: 'none' }}
                  containerStyle={{ display: 'block' }}
                  tabs={
                    familyHistory.length > 1
                      ? familyHistory.map(x => (
                          <p key={x.family_history_id}>
                            {truncate(x.family_history_id, { length: 11 })}
                          </p>
                        ))
                      : null
                  }
                  tabContent={familyHistory.map(x => (
                    <EntityPageVerticalTable
                      key={x.family_history_id}
                      thToTd={[
                        { th: 'UUID', td: x.family_history_id },
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
                        { th: 'Relationship Type', td: x.relationship_type },
                        {
                          th: 'Relative with Cancer History',
                          td: x.relative_with_cancer_history,
                        },
                      ]}
                    />
                  ))}
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
                  contentStyle={{ border: 'none' }}
                  containerStyle={{ display: 'block' }}
                  tabs={
                    exposures.length > 1
                      ? exposures.map(x => (
                          <p key={x.node.exposure_id}>
                            {truncate(x.node.exposure_id, { length: 11 })}
                          </p>
                        ))
                      : null
                  }
                  tabContent={exposures.map(x => (
                    <EntityPageVerticalTable
                      key={x.node.exposure_id}
                      thToTd={[
                        { th: 'UUID', td: x.node.exposure_id },
                        { th: 'Alcohol History', td: x.node.alcohol_history },
                        { th: 'BMI', td: x.node.bmi },
                        {
                          th: 'Cigarettes per Day',
                          td: x.node.cigarettes_per_day,
                        },
                        { th: 'Height', td: x.node.height },
                        { th: 'Weight', td: x.node.weight },
                        { th: 'Years Smoked', td: x.node.years_smoked },
                      ]}
                    />
                  ))}
                />
              )}
              {!totalExposures && (
                <h3 style={{ paddingLeft: '2rem' }}>No Exposures Found.</h3>
              )}
            </div>
          )}
        </Tabs>
      </Card>
    );
  },
);
