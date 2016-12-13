/* global $ */

// Vendor
import React, { Component } from 'react';
import _ from 'lodash';

// Custom
import Lolliplot from '@oncojs/lolliplot';
import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import withDropdown from './uikit/withDropdown';
import EntityPageVerticalTable from './components/EntityPageVerticalTable';
import ProteinLolliplotComponent from './components/ProteinLolliplot';
import FrequentMutations from './components/FrequentMutations';
import { ExternalLink } from './uikit/Links';
import externalReferenceLinks from './utils/externalReferenceLinks';
import MinusIcon from './theme/icons/Minus';
import PlusIcon from './theme/icons/Plus';
import TableIcon from './theme/icons/Table';
import BookIcon from './theme/icons/Book';
import ChartIcon from './theme/icons/BarChart';
import CancerDistribution from './components/CancerDistribution';
import Tooltip from './uikit/Tooltip';

export const zDepth1 = {
  boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
};

export const dropdown = {
  ...zDepth1,
  position: 'absolute',
  zIndex: 1,
  minWidth: '165px',
  backgroundColor: 'white',
  textAlign: 'left',
  marginTop: '1rem',
  right: 0,
  outline: 'none',
  maxHeight: '200px',
  overflow: 'auto',
};

const Gene = (() => {
  const styles = {
    heading: {
      flexGrow: 1,
      fontSize: '2.2rem',
      marginBottom: 7,
      marginTop: 7,
      display: 'flex',
      alignItems: 'center',
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
    card: {
      backgroundColor: 'white',
    },
  };

  const impactColors = {
    HIGH: 'rgb(185, 36, 36)',
    MODERATE: 'rgb(193, 158, 54)',
    LOW: 'rgb(49, 161, 60)',
  };

  const strandIconMap = {
    '-1': <MinusIcon />,
    1: <PlusIcon />,
  };

  return class extends Component {
    constructor() {
      super();

      this.state = {
        ProteinLolliplot: {},
      };

      this.renderProteinLolliplot = this.renderProteinLolliplot.bind(this);
    }

    componentDidMount() {
      this.renderProteinLolliplot();
    }

    renderProteinLolliplot() {
      this.setState({
        ProteinLolliplot: Lolliplot({
          data: this.props.$scope.proteinLolliplotData,
          selector: '#protein-viewer-root',
          onMutationClick: d => { window.location.href = `/mutations/${d.id}`; },
          onMutationMouseover: d => {
            $('.global-tooltip')
              .addClass('active')
              .html(`
                <div>DNA Change: ${d.genomic_dna_change}</div>
                <div># of Cases: ${d.donors}</div>
                <div>Functional Impact: ${d.impact}</div>
              `);
          },
          onMutationMouseout: () => $('.global-tooltip').removeClass('active'),
          onProteinMouseover: d => {
            $('.global-tooltip')
              .addClass('active')
              .html(`
                <div>${d.id}</div>
                <div>${d.description}</div>
                <div><b>Click to zoom</b></div>
              `);
          },
          onProteinMouseout: () => $('.global-tooltip').removeClass('active'),
          height: 450,
          domainWidth: this.props.$scope.geneTranscript.length_amino_acid,
        }),
      });
    }

    render() {
      const {
        gene,
        $scope,
        frequentMutations: fm,
      } = this.props;

      const allCasesAggByProject = gene.allCasesAgg.reduce((acc, bucket) =>
        ({ ...acc, [bucket.key]: bucket.doc_count }), {}
      );

      const cancerDistData = gene.case.reduce((acc, c) => {
        const cases = [...new Set([...(acc[c.project.project_id] || { cases: [] }).cases, c.case_id])];
        return {
          ...acc,
          [c.project.project_id]: {
            disease_type: c.project.disease_type,
            cancer_type: c.project.cancer_type || 'tbd',
            site: c.project.primary_site,
            cases,
            ssms: [...new Set([...(acc[c.project.project_id] || { ssms: [] }).ssms, ...c.ssm.map(m => m.ssm_id)])],
            freq: cases.length / allCasesAggByProject[c.project.project_id],
          },
        };
      }, {});

      const sortedCancerDistData = Object.keys(cancerDistData)
        .map(k => ({ project_id: k, ...cancerDistData[k] }))
        .sort((a, b) => b.freq - a.freq);

      const totalNumCases = Object.keys(allCasesAggByProject).reduce((sum, b) => sum + allCasesAggByProject[b], 0);

      const frequentMutations = fm.map(x => {
        const consequence = x.consequence.find(c => c.transcript.is_canonical);
        return {
          ...x,
          num_affected_cases_all: x.occurrence.length,
          num_affected_cases_by_project: x.occurrence.reduce((acc, o) => ({
            ...acc,
            [o.case.project.project_id]: acc[o.case.project.project_id] ? acc[o.case.project.project_id] + 1 : 1,
          }), {}),
          impact: consequence.transcript.annotation.impact,
          consequence_type: (
            <span>
              <b>{_.startCase(consequence.transcript.consequence_type.replace('variant', ''))}</b>
              <span style={{ marginLeft: '5px' }}>
                <a href={`/genes/${consequence.transcript.gene.gene_id}`}>{consequence.transcript.gene_symbol}</a>
              </span>
              <span
                style={{
                  marginLeft: '5px',
                  color: impactColors[consequence.transcript.annotation.impact] || 'inherit',
                }}
              >
                {consequence.transcript.aa_change}
              </span>
            </span>
          ),
        };
      });

      return (
        <span>
          <Row spacing="2rem">
            <EntityPageVerticalTable
              id="summary"
              title={<span><TableIcon style={{ marginRight: '1rem' }} />Summary</span>}
              thToTd={[
                { th: 'Symbol', td: gene.symbol },
                { th: 'Name', td: gene.name },
                { th: 'Synonyms',
                  collapsibleTd: gene.synonyms.join(', '),
                  style: {
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'breakWord',
                  },
                },
                { th: 'Type', td: gene.biotype },
                {
                  th: 'Location',
                  td: `chr${gene.gene_chromosome}:${gene.gene_start}-${gene.gene_end}
                    (${(gene.case || [{ ssm: [{ ncbi_build: '--' }] }])[0].ssm[0].ncbi_build})`,
                },
                { th: 'Strand', td: gene.gene_strand ? strandIconMap[gene.gene_strand.toString(10)] : '--' },
                { th: 'Description',
                  collapsibleTd: gene.description,
                  style: {
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'breakWord',
                    lineHeight: '2.2rem',
                  },
                },
              ]}
              style={{
                ...styles.summary,
                ...styles.column,
                alignSelf: 'flex-start',
              }}
            />
            <EntityPageVerticalTable
              title={<span><BookIcon style={{ marginRight: '1rem' }} /> External References</span>}
              thToTd={
                Object.keys(gene.external_db_ids || {}).map(db => ({
                  th: db.replace(/_/g, ' '),
                  td: (
                    <ExternalLink
                      href={externalReferenceLinks[db](gene.external_db_ids[db])}
                    >
                      {gene.external_db_ids[db]}
                    </ExternalLink>
                  ),
                }))
              }
              style={{ ...styles.summary, ...styles.column, alignSelf: 'flex-start' }}
            />
          </Row>
          <Column style={styles.card} id="cancer-distribution">
            <Row>
              <h1 style={{ ...styles.heading, padding: '1rem' }}>
                <ChartIcon style={{ marginRight: '1rem' }} />
                Cancer Distribution
              </h1>
            </Row>
            <CancerDistribution
              tableHeadings={[
                { key: 'project_id', title: 'Project ID' },
                { key: 'disease_type', title: 'Disease Type' },
                { key: 'site', title: 'Site' },
                { key: 'num_affected_cases',
                  title: (
                    <Tooltip
                      innerHTML={`Number of Cases where ${gene.symbol} contains SSM`}
                    >
                      # Affected Cases
                    </Tooltip>
                  ),
                },
                { key: 'num_mutations',
                  title: <Tooltip innerHTML={`Number of SSM observed in ${gene.symbol}`}># Mutations</Tooltip>,
                  style: { textAlign: 'right' },
                },
              ]}
              tableData={sortedCancerDistData.map(d => ({
                ...d,
                project_id: <a href={`/projects/${d.project_id}`}>{d.project_id}</a>,
                num_affected_cases:
                  `${d.cases.length}/${allCasesAggByProject[d.project_id]} (${(d.freq * 100).toFixed(2)}%)`,
                num_mutations: d.ssms.length,
              }))}
              chartData={sortedCancerDistData.map(d => ({
                label: d.project_id,
                value: (d.freq * 100),
                href: `projects/${d.project_id}`,
                tooltip: `
                  DNA Change<br />
                  ${d.cases.length} Case${d.cases.length > 1 ? 's' : ''} Affected in <b>${d.project_id}</b><br />
                  ${d.cases.length} / ${allCasesAggByProject[d.project_id]}&nbsp;(${(d.freq * 100).toFixed(2)})%
                `,
              }))}
              tagline={`${sortedCancerDistData.reduce((acc, d) => [...acc, ...d.cases], []).length} cases affected by
                ${sortedCancerDistData.reduce((acc, d) => [...acc, ...d.ssms], []).length} mutations across
                ${sortedCancerDistData.length} projects`
              }
            />
          </Column>

          <Column style={{ ...styles.card, marginTop: '2rem' }}>
            <ProteinLolliplotComponent
              gene={gene}
              $scope={$scope}
              reset={this.state.ProteinLolliplot.reset}
            />
          </Column>

          <Column style={{ ...styles.card, marginTop: '2rem' }}>
            <h1 style={{ ...styles.heading, padding: '1rem' }} id="frequent-mutations">
              <ChartIcon style={{ marginRight: '1rem' }} />
              Most Frequent Mutations
            </h1>

            <FrequentMutations
              frequentMutations={frequentMutations.map(m => ({ ...m, score: m._score }))}
              totalNumCases={totalNumCases}
              showSurvivalPlot={false}
            />
          </Column>
        </span>
      );
    }
  };
})();

export default withDropdown(Gene);
