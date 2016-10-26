// Vendor
import React from 'react';
import GeneIcon from 'react-icons/lib/fa/google';
import FileIcon from 'react-icons/lib/fa/file-o';
import CaseIcon from 'react-icons/lib/fa/user';
import EditIcon from 'react-icons/lib/fa/edit';
import CartIcon from 'react-icons/lib/fa/shopping-cart';
import SearchIcon from 'react-icons/lib/fa/search';

// Custom
import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import Button from './Button';
import EntityPageVerticalTable from './components/EntityPageVerticalTable';
import EntityPageHorizontalTable from './components/EntityPageHorizontalTable';
import CountCard from './components/CountCard';
import { ExternalLink } from './uikit/Links';
import BarChart from './charts/BarChart';
import theme from './theme';

let Gene = (() => {
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

  const externalReferenceLinks = {
    hgnc: id => `http://www.genenames.org/data/hgnc_data.php?hgnc_id=${id}`,
    ensembl: id => `http://feb2014.archive.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=${id}`,
    entrez_gene: id => `http://www.ncbi.nlm.nih.gov/gene/${id}`,
    omim_gene: id => `http://omim.org/entry/${id}`,
    uniprotkb_swissprot: id => `http://www.uniprot.org/uniprot/${id}`,
    transcript: id => `http://feb2014.archive.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;t=${id}`,
  };

  return ({ gene }) => {
    const allCasesAggByProject = gene.allCasesAgg.reduce((acc, bucket) => ({...acc, [bucket.key]: bucket.doc_count}), {});
    const cancerDistData = gene.case.reduce(
      (acc, c) => {
        const cases = [...new Set([...(acc[c.project.project_id] || { cases: [] }).cases, c.case_id])];
        return {...acc,
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

    return  (<Column style={styles.container}>
        <Row style={{
            justifyContent: 'space-between',
            marginTop: '1rem',
          }}>
            <h1 style={styles.heading}>
              <GeneIcon style={{ margin: '1rem' }}/>
              { gene.gene_id }
            </h1>
        </Row>
        <Row spacing="2rem">
          <EntityPageVerticalTable
            title="Summary"
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
              { th: 'Type', td: gene.biotype},
              { th: 'Location', td: `chr${gene.gene_chromosome}:${gene.gene_start}-${gene.gene_end} (${(gene.case||[{ssm: [{ncbi_build: '--'}]}])[0].ssm[0].ncbi_build})`},
              { th: 'Strand', td: gene.gene_strand},
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
            title="External References"
            thToTd={
              Object.keys(gene.external_db_ids || {})
                    .map(db => ({
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
        <Column>
          <h3>Cancer Distribution</h3>
        </Column>
        {sortedCancerDistData.reduce((acc, d) => [...acc, ...d.cases], []).length} cases affected by&nbsp;
        {sortedCancerDistData.reduce((acc, d) => [...acc, ...d.ssms], []).length} mutations across&nbsp;
        {sortedCancerDistData.length} projects
        <Column style={{...styles.column, paddingBottom: '2rem'}}>
          <BarChart
            data={sortedCancerDistData.map(d => ({label: d.project_id, value: (d.freq * 100)}))}
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
              { key: 'num_mutations', title: '# Mutations'},
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
    );
  }
})()

export default Gene;
