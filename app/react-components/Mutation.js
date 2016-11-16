// Vendor
import React, { Component } from 'react';
import GeneIcon from 'react-icons/lib/fa/google';
import FileIcon from 'react-icons/lib/fa/file-o';
import CaseIcon from 'react-icons/lib/fa/user';
import EditIcon from 'react-icons/lib/fa/edit';
import CartIcon from 'react-icons/lib/fa/shopping-cart';
import MinusIcon from 'react-icons/lib/fa/minus';
import PlusIcon from 'react-icons/lib/fa/plus';
import TableIcon from 'react-icons/lib/fa/table';
import BookIcon from 'react-icons/lib/fa/book';
import ChartIcon from 'react-icons/lib/fa/bar-chart'
import _ from 'lodash';

// Custom
import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import Button from './Button';
import EntityPageVerticalTable from './components/EntityPageVerticalTable';
import EntityPageHorizontalTable from './components/EntityPageHorizontalTable';
import ProteinLolliplotComponent from './components/ProteinLolliplot';
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
      minWidth: '450px',
    },
    column: {
      width: '100%',
      minWidth: 450,
    },
    card: {
      backgroundColor: 'white',
    },
  };

  return class Mutation extends Component {
    constructor() {
      super();

      this.state = {
        ProteinLolliplot: {}
      };

      this.renderProteinLolliplot = this.renderProteinLolliplot.bind(this);
    }

    componentDidMount() {
      this.renderProteinLolliplot();

      setTimeout(() => {
        window.selectedMutation = document.querySelector('[filter="url(#drop-shadow)"]');

        let d = this.props.$scope.proteinLolliplotData.mutations.find(x => x.id === this.props.mutation.ssm_id);

        $('.global-tooltip')
          .addClass('active')
          .html(`
            <div>DNA Change: ${d.genomic_dna_change}</div>
            <div># of Cases: ${d.donors}</div>
            <div>Functional Impact: ${d.impact}</div>
          `);
      }, 100)
    }

    componentWillUnmount() {
      window.selectedMutation = null;
    }

    renderProteinLolliplot() {
      this.setState({
        ProteinLolliplot: ProteinLolliplot.default({
          data: this.props.$scope.proteinLolliplotData,
          selector: `#protein-viewer-root`,
          onMutationClick: d => window.location.href = `/mutations/${d.id}`,
          onMutationMouseover: d => {
            if (d.id !== this.props.mutation.ssm_id) window.otherTooltip = true;
            $('.global-tooltip')
              .addClass('active')
              .html(`
                <div>DNA Change: ${d.genomic_dna_change}</div>
                <div># of Cases: ${d.donors}</div>
                <div>Functional Impact: ${d.impact}</div>
              `);
          },
          onMutationMouseout: () => window.otherTooltip = false,
          onProteinMouseover: d => {
            window.otherTooltip = true;
            $('.global-tooltip')
              .addClass('active')
              .html(`
                <div>${d.id}</div>
                <div>${d.description}</div>
                <div><b>Click to zoom</b></div>
              `);
          },
          onProteinMouseout: () => window.otherTooltip = false,
          height: 450,
          domainWidth: this.props.$scope.geneTranscript.length_amino_acid,
          mutationId: this.props.mutation.ssm_id,
        }),
      });
    }

    render() {
      let { mutation, $scope, allCasesAgg } = this.props
      let { gene } = $scope;

      const allCasesAggByProject = allCasesAgg.reduce((acc, bucket) =>
        ({...acc, [bucket.key]: bucket.doc_count}), {}
      );

      const externalDbIds = mutation.consequence.reduce(
        (acc, c) => {
          if (c.transcript.is_canonical) {
            return c.transcript.gene.external_db_ids;
          }
          return acc;
      }, {});

      const annotatedConsequence = _.find(mutation.consequence, c =>
        Object.keys(c.transcript.annotation).length > 0
      )

      const functionalImpact = (annotatedConsequence || { transcript: { annotation: { impact: '' } } })
        .transcript.annotation.impact.toLowerCase();

      const cancerDistData = mutation.occurrence.reduce((acc, o) => {
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

      const strandIconMap = {
        '-1': <MinusIcon />,
        '1': <PlusIcon />,
      };

      const consequenceData = mutation.consequence.reduce((acc, c) => {
        const transcripts = [...new Set([...(acc[c.transcript.gene.gene_id] || { transcripts: [] }).transcripts, c.transcript.transcript_id])];
        let canonicalOnly = {};
        if (c.transcript.is_canonical) {
          canonicalOnly = {
            aa_change: c.transcript.aa_change,
            coding_dna_change: c.transcript.annotation.hgvsc,
            consequence: c.transcript.consequence_type,
            strand: c.transcript.gene.gene_strand,
          };
        }
        return {...acc,
          [c.transcript.gene.gene_id]: {
            ...acc[c.transcript.gene.gene_id],
            gene_id: c.transcript.gene.gene_id,
            gene_symbol: c.transcript.gene_symbol,
            transcripts: transcripts,
            ...canonicalOnly
          }
        };
      }, {});

      const consquenceDataMapped = Object.keys(consequenceData)
        .map(d => ({
          ...consequenceData[d],
          gene_symbol: <a href={`/genes/${consequenceData[d].gene_id}`}>{consequenceData[d].gene_symbol}</a>,
          transcripts: (
            <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 0 }}>
              {consequenceData[d].transcripts.map(t => <li key={t}>{t}</li>)}
            </ul>
          ),
          strand: consequenceData[d].strand && strandIconMap[consequenceData[d].strand.toString(10)],
        }))
        .filter(d => d.gene_id);

      return (
        <span>
          <Row spacing="2rem" id="summary">
            <EntityPageVerticalTable
              id="Summary"
              title={<span><TableIcon style={{ marginRight: '1rem' }}/>Summary</span>}
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
            {!!Object.keys(externalDbIds).length &&
              <EntityPageVerticalTable
                title={<span><BookIcon style={{ marginRight: '1rem' }}/> External References</span>}
                thToTd={
                  Object.keys(externalDbIds).map(db => ({
                    th: db.replace(/_/g, ' '),
                    td: externalDbIds[db].map(id =>
                      <ExternalLink
                        key={id}
                        style={{ paddingRight: '0.5em' }}
                        href={externalReferenceLinks[db](id)}
                      >
                        {id}
                      </ExternalLink>
                    )
                  }))
              }
              style={{...styles.summary, ...styles.column, alignSelf: 'flex-start'}}
            />}
          </Row>
          <Column style={styles.card}>
            <h1 id="consequences" style={{...styles.heading, padding: `1rem` }}>
              <TableIcon style={{ marginRight: '1rem' }}/>
              Consequences
            </h1>
            <Row>
              <EntityPageHorizontalTable
                style={{width: '100%', minWidth: '450px'}}
                headings={[
                  { key: 'gene_symbol', title: 'Gene' },
                  { key: 'aa_change', title: 'AA Change' },
                  { key: 'consequence', title: 'Consequence' },
                  { key: 'coding_dna_change', title: 'Coding DNA Change'},
                  { key: 'strand', title: 'Strand'},
                  { key: 'transcripts', title: 'Transcript(s)'},
                ]}
                data={consquenceDataMapped}
              />
            </Row>
          </Column>
          <Column style={{...styles.card, marginTop: `2rem` }}>
            <h1 id="cancer-distribution" style={{...styles.heading, padding: `1rem` }}>
              <ChartIcon style={{ marginRight: '1rem' }}/>
              Cancer Distribution
            </h1>
            <h5 style={{textTransform: 'uppercase', padding: `0 2rem`}}>
              This mutation affects&nbsp;
              {sortedCancerDistData.reduce((acc, d) => [...acc, ...d.cases], []).length} distinct cases across&nbsp;
              {sortedCancerDistData.length} cancer projects
            </h5>
            <Column style={{...styles.column}}>
              {sortedCancerDistData.length >= 5 &&
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
              }
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
          </Column>
          <Column style={{...styles.card, marginTop: `2rem` }}>
            <ProteinLolliplotComponent
              gene={gene}
              $scope={$scope}
              reset={this.state.ProteinLolliplot.reset}
            />
          </Column>
        </span>
      );
    }
  }
})()

export default Mutation;
