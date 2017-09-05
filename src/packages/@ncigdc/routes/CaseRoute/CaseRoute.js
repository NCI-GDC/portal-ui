// @flow
import React from 'react';
import { parse } from 'query-string';
import Column from '@ncigdc/uikit/Flex/Column';
import Row from '@ncigdc/uikit/Flex/Row';
import ST from '@ncigdc/modern_components/SsmsTable';
import GdcDataIcon from '@ncigdc/theme/icons/GdcData';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import ClinicalCard from '@ncigdc/modern_components/ClinicalCard';
import CaseSummary from '@ncigdc/modern_components/CaseSummary';
import AddOrRemoveAllFilesButton from '@ncigdc/modern_components/AddOrRemoveAllFilesButton';
import { makeFilter } from '@ncigdc/utils/filters';
import {
  CaseCountsDataCategory,
  CaseCountsExpStrategy,
} from '@ncigdc/modern_components/CaseCounts';
import BiospecimenCard from '@ncigdc/modern_components/BiospecimenCard';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import createCaseSummary from '@ncigdc/modern_components/CaseSummary/CaseSummary.relay';
import Exists from '@ncigdc/modern_components/Exists';

const SsmsTable = createCaseSummary(
  ({
    viewer,
    node = viewer.repository.cases.hits.edges[0].node,
    projectId = node.project.project_id,
    ...props
  }) =>
    <ST
      {...props}
      contextFilters={makeFilter([
        { field: 'cases.project.project_id', value: projectId },
      ])}
      context={projectId}
      hideSurvival
    />,
);

const styles = {
  column: {
    flexGrow: 1,
  },
  icon: {
    width: '4rem',
    height: '4rem',
    color: '#888',
  },
  card: {
    backgroundColor: 'white',
  },
  heading: {
    flexGrow: 1,
    fontSize: '2rem',
    marginBottom: 7,
    marginTop: 7,
  },
};

export default ({
  match,
  caseId = match.params.id,
  location,
  query = parse(location.search),
}: Object) => {
  const fmFilters = makeFilter([{ field: 'cases.case_id', value: caseId }]);

  return (
    <Exists type="Case" id={caseId}>
      <FullWidthLayout title={caseId} entityType="CA">
        <Column spacing="2rem" className="test-case">
          <Row style={{ justifyContent: 'flex-end' }}>
            <AddOrRemoveAllFilesButton
              caseId={caseId}
              style={{ width: 'auto' }}
            />
          </Row>
          <CaseSummary caseId={caseId} />
          <Row style={{ flexWrap: 'wrap' }} spacing={'2rem'}>
            <span style={{ ...styles.column, marginBottom: '2rem', flex: 1 }}>
              <CaseCountsDataCategory caseId={caseId} />
            </span>
            <span style={{ ...styles.column, marginBottom: '2rem', flex: 1 }}>
              <CaseCountsExpStrategy caseId={caseId} />
            </span>
          </Row>

          <Row id="clinical" style={{ flexWrap: 'wrap' }} spacing="2rem">
            <ClinicalCard caseId={caseId} />
          </Row>

          <Row id="biospecimen" style={{ flexWrap: 'wrap' }} spacing="2rem">
            <BiospecimenCard caseId={caseId} bioId={query.bioId} />
          </Row>
          <Column style={{ ...styles.card, marginTop: '2rem' }}>
            <Row style={{ padding: '1rem 1rem 2rem', alignItems: 'center' }}>
              <h1 style={{ ...styles.heading }} id="frequent-mutations">
                <i
                  className="fa fa-bar-chart-o"
                  style={{ paddingRight: '10px' }}
                />
                Most Frequent Somatic Mutations
              </h1>
              <ExploreLink
                query={{ searchTableTab: 'mutations', filters: fmFilters }}
              >
                <GdcDataIcon /> Open in Exploration
              </ExploreLink>
            </Row>
            <Column>
              <SsmsTable caseId={caseId} defaultFilters={fmFilters} />
            </Column>
          </Column>
        </Column>
      </FullWidthLayout>
    </Exists>
  );
};
