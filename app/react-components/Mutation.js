// Vendor
import React from 'react';
import GeneIcon from 'react-icons/lib/fa/google';
import FileIcon from 'react-icons/lib/fa/file-o';
import CaseIcon from 'react-icons/lib/fa/user';
import EditIcon from 'react-icons/lib/fa/edit';
import CartIcon from 'react-icons/lib/fa/shopping-cart';
import _ from 'lodash';

// Custom
import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import Button from './Button';
import EntityPageVerticalTable from './components/EntityPageVerticalTable';
import EntityPageHorizontalTable from './components/EntityPageHorizontalTable';
import CountCard from './components/CountCard';
import { ExternalLink } from './uikit/Links';
import externalReferenceLinks from './utils/externalReferenceLinks';
import BarChart from './charts/BarChart';
import theme from './theme';

let Mutation = (() => {
  const styles = {
    container: {
      width: '80%',
      margin: 'auto',
    },
    heading: {
      flexGrow: 1,
      fontSize: '2rem',
      marginBottom: 7,
      marginTop: 7,
    },
    buttons: {
      flex: 'none',
      color: '#fff',
      backgroundColor: '#0d95a1',
      marginLeft: '0.2rem',
    },
    countCard: {
      width: 'auto',
      marginBottom: '2rem',
    },
    summary: {
      marginBottom: '2rem',
    },
    column: {
      width: '100%',
      minWidth: 450,
    },
  };

  return ({ mutation, allCasesAgg }) => {
    const allCasesAggByProject = allCasesAgg.reduce((acc, bucket) => ({...acc, [bucket.key]: bucket.doc_count}), {});
    const externalDbIds = mutation.consequence.reduce(
      (acc, c) => {
        const edb = c.transcript.gene.external_db_ids;
        return Object.keys(edb || {}).reduce((newAcc, k) => Object.assign(
          newAcc,
          {[k]: [...new Set([...(acc[k] || []), ...edb[k]])]}),
          {});
      }, {});
    const annotatedConsequence = _.find(mutation.consequence, c => Object.keys(c.transcript.annotation).length > 0)
    const functionalImpact = (annotatedConsequence || { transcript: { annotation: { impact: '' } } }).transcript.annotation.impact.toLowerCase();
    const cancerDistData = mutation.occurrence.reduce(
      (acc, o) => {
        const cases = [...new Set([...(acc[o.case.project.project_id] || { cases: [] }).cases, o.case.case_id])];
        return {...acc,
          [o.case.project.project_id]: {
          disease_type: o.case.project.disease_type,
          cancer_type: o.case.project.cancer_type || 'tbd',
          site: o.case.project.primary_site,
          cases: cases,
          freq: cases.length/allCasesAggByProject[o.case.project.project_id],
          }
        };
      }, {});
    const sortedCancerDistData = Object.keys(cancerDistData)
      .map(k => ({project_id: k, ...cancerDistData[k]}))
      .sort((a, b) => b.freq - a.freq);

    return (
      <span>
        <Row style={{
            justifyContent: 'space-between',
            marginTop: '1rem',
          }}>
            <h1 style={styles.heading} id="summary">
              { mutation.ssm_id }
            </h1>
        </Row>
        <Row spacing="2rem">
          <EntityPageVerticalTable
            title="Summary"
            thToTd={[
              { th: 'ID', td: mutation.ssm_id },
              { th: 'DNA change', td: `${mutation.chromosome}:g.${mutation.start_position}${mutation.reference_allele}>${mutation.tumor_allele}`},
              { th: 'Type', td: mutation.variant_type || ''},
              { th: 'Reference genome assembly', td: mutation.ncbi_build || ''},
              { th: 'Allele in the reference assembly', td: mutation.reference_allele || ''},
              { th: 'Functonal Impact', td: functionalImpact || '', style: { textTransform: 'capitalize' } },
            ]}
            style={{
              ...styles.summary,
              ...styles.column,
              alignSelf: 'flex-start',
            }}
          />
          {Object.keys(externalDbIds) && <EntityPageVerticalTable
            title="External References"
            thToTd={
              Object.keys(externalDbIds)
                    .map(db => ({
                      th: db.replace(/_/g, ' '),
                      td: externalDbIds[db].map(id => (
                        <ExternalLink
                        key={id}
                        style={{ paddingRight: '0.5em' }}
                        href={externalReferenceLinks[db](id)}>
                          {id}
                        </ExternalLink>))
                    }))
            }
            style={{...styles.summary, ...styles.column, alignSelf: 'flex-start'}}
          />}
        </Row>
        <Column>
          <h1 id="cancer-distribution" style={styles.heading}>
            <i className="fa fa-bar-chart-o" style={{ marginRight: `1rem` }} />
            Cancer Distribution
          </h1>
        </Column>
        <h5 style={{textTransform: 'uppercase'}}>
        { mutation.ssm_id } affects&nbsp;
        {sortedCancerDistData.reduce((acc, d) => [...acc, ...d.cases], []).length} distinct cases across&nbsp;
        {sortedCancerDistData.length} cancer projects
        </h5>
        <Column style={{...styles.column, paddingBottom: '2rem'}}>
          <BarChart
            data={sortedCancerDistData.map(d => ({
              label: d.project_id,
              value: (d.freq * 100),
              tooltip: `<b>${d.project_id}</b><br />${(d.freq * 100).toFixed(2)}%`
              }))
            }
            yAxis={{ title: '% of Cases Affected' }}
            styles={{
              xAxis: {stroke: theme.greyScale4, textFill: theme.greyScale3},
              yAxis: {stroke: theme.greyScale4, textFill: theme.greyScale3},
              bars: {fill: theme.secondary},
              tooltips: {
                fill: '#fff',
                stroke: theme.greyScale4,
                textFill: theme.greyScale3
              }
            }}
          />
          <EntityPageHorizontalTable
            headings={[
              { key: 'project_id', title: 'Project ID' },
              { key: 'disease_type', title: 'Disease Type' },
              { key: 'site', title: 'Site' },
              { key: 'num_affected_cases', title: '# Affected Cases'},
            ]}
            data={sortedCancerDistData.map(
              d => ({
                ...d,
                project_id: <a href={`/projects/${d.project_id}`}>{d.project_id}</a>,
                num_affected_cases: `${d.cases.length}/${allCasesAggByProject[d.project_id]} (${(d.freq * 100).toFixed(2)}%)`,
              })
            )}
          />
        </Column>
      </span>
    );
  }
})()

export default Mutation;
