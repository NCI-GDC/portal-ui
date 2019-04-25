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
import CaseSymbol from '@ncigdc/modern_components/CaseSymbol';
import HasSsms from '@ncigdc/modern_components/HasSsms';
import { AWG } from '@ncigdc/utils/constants';

const SsmsTable = createCaseSummary(
  ({
    viewer,
    node = viewer.repository.cases.hits.edges[0].node,
    projectId = node.project.project_id,
    ...props
  }) => (
    <ST
      {...props}
      context={projectId}
      contextFilters={makeFilter([
        {
          field: 'cases.project.project_id',
          value: projectId,
        },
      ])}
      hideSurvival />
  ),
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
  const fmFilters = makeFilter([
    {
      field: 'cases.case_id',
      value: caseId,
    },
  ]);

  return (
    <Exists id={caseId} type="Case">
      <FullWidthLayout entityType="CA" title={<CaseSymbol caseId={caseId} />}>
        <Column className="test-case" spacing="2rem">
          <Row style={{ justifyContent: 'flex-end' }}>
            <AddOrRemoveAllFilesButton
              caseId={caseId}
              style={{ width: 'auto' }} />
          </Row>
          <CaseSummary caseId={caseId} />
          <Row spacing="2rem" style={{ flexWrap: 'wrap' }}>
            <span style={{
              ...styles.column,
              marginBottom: '2rem',
              flex: 1,
            }}>
              <CaseCountsDataCategory caseId={caseId} />
            </span>
            <span style={{
              ...styles.column,
              marginBottom: '2rem',
              flex: 1,
            }}>
              <CaseCountsExpStrategy caseId={caseId} />
            </span>
          </Row>

          <Row id="clinical" spacing="2rem" style={{ flexWrap: 'wrap' }}>
            <ClinicalCard caseId={caseId} />
          </Row>

          <Row id="biospecimen" spacing="2rem" style={{ flexWrap: 'wrap' }}>
            <BiospecimenCard bioId={query.bioId} caseId={caseId} />
          </Row>
          {!AWG && (
            <HasSsms caseId={caseId}>
              <Column style={{
                ...styles.card,
                marginTop: '2rem',
              }}>
                <Row
                  style={{
                    padding: '1rem 1rem 2rem',
                    alignItems: 'center',
                  }}>
                  <h1 id="frequent-mutations" style={{ ...styles.heading }}>
                    <i
                      className="fa fa-bar-chart-o"
                      style={{ paddingRight: '10px' }} />
                    Most Frequent Somatic Mutations
                  </h1>
                  <ExploreLink
                    query={{
                      searchTableTab: 'mutations',
                      filters: fmFilters,
                    }}>
                    <GdcDataIcon />
                    {' '}
Open in Exploration
                  </ExploreLink>
                </Row>
                <Column>
                  <SsmsTable caseId={caseId} defaultFilters={fmFilters} />
                </Column>
              </Column>
            </HasSsms>
          )}
        </Column>
      </FullWidthLayout>
    </Exists>
  );
};
