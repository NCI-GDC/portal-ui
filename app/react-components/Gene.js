// Vendor
import React, { Component } from 'react';
import GeneIcon from 'react-icons/lib/fa/google';
import FileIcon from 'react-icons/lib/fa/file-o';
import CaseIcon from 'react-icons/lib/fa/user';
import EditIcon from 'react-icons/lib/fa/edit';
import CartIcon from 'react-icons/lib/fa/shopping-cart';
import SearchIcon from 'react-icons/lib/fa/search';
import MinusIcon from 'react-icons/lib/fa/minus';
import PlusIcon from 'react-icons/lib/fa/plus';
import _ from 'lodash';

// Custom
import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import withDropdown from './uikit/withDropdown';
import Button from './Button';
import EntityPageVerticalTable from './components/EntityPageVerticalTable';
import EntityPageHorizontalTable from './components/EntityPageHorizontalTable';
import CountCard from './components/CountCard';
import ProteinLolliplotComponent from './components/ProteinLolliplot';
import FrequentMutations from './components/FrequentMutations';
import { ExternalLink } from './uikit/Links';
import BarChart from './charts/BarChart';
import theme from './theme';
import externalReferenceLinks from './utils/externalReferenceLinks';
import downloadSvg from './utils/download-svg';

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

let Gene = (() => {
  const styles = {
    heading: {
      flexGrow: 1,
      fontSize: '2.2rem',
      marginBottom: 7,
      marginTop: 7,
      display: 'flex',
      alignItems: 'center',
    },
    buttons: {
      flex: 'none',
      color: '#fff',
      backgroundColor: '#0d95a1',
      marginLeft: '0.2rem',
    },
    button: {
      color: '#333',
      backgroundColor: '#fff',
      borderColor: '#ccc',
      marginRight: 12,
      minWidth: 46,
      minHeight: 34,
      display: 'inline-flex',
      outline: 'none',
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
      backgroundColor: `white`,
    },
  };

  const strandIconMap = {
    '-1': <MinusIcon />,
    '1': <PlusIcon />,
  };

  return class Gene extends Component {
    constructor() {
      super();

      this.state = {
        ProteinLolliplot: {}
      };

      this.renderProteinLolliplot = this.renderProteinLolliplot.bind(this);
    }

    componentDidMount() {
      this.renderProteinLolliplot();
    }

    renderProteinLolliplot() {
      this.setState({
        ProteinLolliplot: ProteinLolliplot.default({
          data: this.props.$scope.proteinLolliplotData,
          selector: `#protein-viewer-root`,
          onMutationClick: d => window.location.href = `/mutations/${d.id}`,
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
      let {
        gene,
        $scope,
        setActive,
        active,
        mouseDownHandler,
        mouseUpHandler,
        frequentMutations: fm,
      } = this.props

      const allCasesAggByProject = gene.allCasesAgg.reduce((acc, bucket) =>
        ({...acc, [bucket.key]: bucket.doc_count}), {}
      );

      const cancerDistData = gene.case.reduce(
        (acc, c) => {
          const cases = [...new Set([...(acc[c.project.project_id] || { cases: [] }).cases, c.case_id])];
          return {
            ...acc,
            [c.project.project_id]: {
              disease_type: c.project.disease_type,
              cancer_type: c.project.cancer_type || 'tbd',
              site: c.project.primary_site,
              cases: cases,
              ssms: [...new Set([...(acc[c.project.project_id] || { ssms: [] }).ssms, ...c.ssm.map(m => m.ssm_id)])],
              freq: cases.length/allCasesAggByProject[c.project.project_id],
            }
          };
        }, {});

      const sortedCancerDistData = Object.keys(cancerDistData)
        .map(k => ({project_id: k, ...cancerDistData[k]}))
        .sort((a, b) => b.freq - a.freq);

      const totalNumCases = Object.keys(allCasesAggByProject).reduce((sum, b) => sum + allCasesAggByProject[b], 0);

      const frequentMutations = fm.map(x => {
        let consequence = x.consequence.find(x => x.transcript.is_canonical);
        return {
          ...x,
          num_affected_cases_all: x.occurrence.length,
          consequence_type:
            <span>
              <b>{_.startCase(consequence.transcript.consequence_type)}</b>
              <span style={{marginLeft:'5px'}}>
                <a href={`/genes/${consequence.transcript.gene.gene_id}`}>{consequence.transcript.gene_symbol}</a>
              </span>
              <span style={{marginLeft:'5px'}}>{consequence.transcript.aa_change}</span>
            </span>
        };
      });

      return (
        <span>
          <Row spacing="2rem">
            <EntityPageVerticalTable
              id="summary"
              title={<span><i className="fa fa-table" /> Summary</span>}
              thToTd={[
                { th: 'Symbol', td: gene.symbol },
                { th: 'Name', td: gene.name },
                { th: 'Synonyms',
                  collapsibleTd: gene.synonyms.join(', '),
                  style: {
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'breakWord',
                  }
                },
                { th: 'Type', td: gene.biotype },
                { th: 'Location', td:
                    `chr${gene.gene_chromosome}:${gene.gene_start}-${gene.gene_end}
                    (${(gene.case||[{ssm: [{ncbi_build: '--'}]}])[0].ssm[0].ncbi_build})`
                },
                { th: 'Strand', td: gene.gene_strand ? strandIconMap[gene.gene_strand.toString(10)] : '--'},
                { th: 'Description',
                  collapsibleTd: gene.description,
                  style: {
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'breakWord',
                    lineHeight: '2.2rem',
                  }
                },
              ]}
              style={{
                ...styles.summary,
                ...styles.column,
                alignSelf: 'flex-start',
              }}
            />
            <EntityPageVerticalTable
              title={<span><i className="fa fa-book" /> External References</span>}
              thToTd={
                Object.keys(gene.external_db_ids || {}).map(db => ({
                  th: db.replace(/_/g, ' '),
                  td: <ExternalLink
                    href={externalReferenceLinks[db](gene.external_db_ids[db])}>
                      {gene.external_db_ids[db]}
                    </ExternalLink>
                }))
              }
              style={{...styles.summary, ...styles.column, alignSelf: 'flex-start'}}
            />
          </Row>

          <Column style={styles.card}>
            <h1 style={{...styles.heading, padding: `1rem` }} id="cancer-distribution">
              <i className="fa fa-bar-chart-o" style={{ marginRight: `1rem` }} />
              Cancer Distribution
            </h1>
            <div style={{ padding: `0 1rem` }}>
              {sortedCancerDistData.reduce((acc, d) => [...acc, ...d.cases], []).length} cases affected by&nbsp;
              {sortedCancerDistData.reduce((acc, d) => [...acc, ...d.ssms], []).length} mutations across&nbsp;
              {sortedCancerDistData.length} projects
            </div>
            <Column style={{...styles.column}}>
              <div style={{ padding: `0 2rem` }}>
                <BarChart
                  data={sortedCancerDistData.map(d => ({
                    label: d.project_id,
                    value: (d.freq * 100),
                    href: `projects/${d.project_id}`,
                    tooltip: `DNA Change<br />\
                      ${d.cases.length} Cases Affected in <b>${d.project_id}</b><br />\
                      ${d.cases.length}/${allCasesAggByProject[d.project_id]}&nbsp;(${(d.freq * 100).toFixed(2)}%}`
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
              </div>
              <EntityPageHorizontalTable
                headings={[
                  { key: 'project_id', title: 'Project ID' },
                  { key: 'disease_type', title: 'Disease Type' },
                  { key: 'site', title: 'Site' },
                  { key: 'num_affected_cases', title: '# Affected Cases', tooltip: `Number of Cases where ${gene.symbol} contains SSM`},
                  { key: 'num_mutations', title: '# Mutations', tooltip: `Number of SSM observed in ${gene.symbol}`},
                ]}
                data={sortedCancerDistData.map(
                  d => ({
                    ...d,
                    project_id: <a href={`/projects/${d.project_id}`}>{d.project_id}</a>,
                    num_affected_cases: `${d.cases.length}/${allCasesAggByProject[d.project_id]} (${(d.freq * 100).toFixed(2)}%)`,
                    num_mutations: d.ssms.length,
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

          <Column style={{...styles.card, marginTop: `2rem`}}>
            <h1 style={{...styles.heading, padding: `1rem` }} id="frequent-mutations">
              <i className="fa fa-bar-chart-o" style={{ paddingRight: `10px` }} />
              Most Frequent Mutations
            </h1>

            <FrequentMutations
              frequentMutations={frequentMutations}
              totalNumCases={totalNumCases}
            />
          </Column>
        </span>
      );
    }
  }
})()

export default withDropdown(Gene);
