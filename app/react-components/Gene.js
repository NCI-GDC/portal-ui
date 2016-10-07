// Vendor
import React from 'react';
import GeneIcon from 'react-icons/lib/fa/google';
import FileIcon from 'react-icons/lib/fa/file-o';
import CaseIcon from 'react-icons/lib/fa/user';
import EditIcon from 'react-icons/lib/fa/edit';
import CartIcon from 'react-icons/lib/fa/shopping-cart';

// Custom
import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import Button from './Button';
import EntityPageVerticalTable from './components/EntityPageVerticalTable';
import EntityPageHorizontalTable from './components/EntityPageHorizontalTable';
import CountCard from './components/CountCard';
import { ExternalLink } from './uikit/Links';

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
  }

  const externalReferenceLinks = {
    hgnc: id => `http://www.genenames.org/data/hgnc_data.php?hgnc_id=${id}`,
    ensembl: id => `http://feb2014.archive.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=${id}`,
    cosmic: id => `http://cancer.sanger.ac.uk/cosmic/gene/analysis?ln=${id}`,
    entrez_gene: id => `http://www.ncbi.nlm.nih.gov/gene/${id}`,
    omim_gene: id => `http://omim.org/entry/${id}`,
    uniprotkb_swissprot: id => `http://www.uniprot.org/uniprot/${id}`,
    transcript: id => `http://feb2014.archive.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;t=${id}`,
  };

  return ({ gene }) => (
    <Column style={styles.container}>
      <Row style={{
          justifyContent: 'space-between',
          marginTop: '1rem',
          marginBottom: '2rem'
        }}>
          <h1 style={styles.heading}>
            <GeneIcon style={{ margin: '1rem' }}/>
            { gene.gene_id }
          </h1>
        <Button
          style={{...styles.buttons, marginTop: '1rem'}}
          leftIcon={
            <CartIcon />
          }
        >
          Add All Files to the Cart
        </Button>
      </Row>
      <Row spacing="2rem">
        <EntityPageVerticalTable
          title="Summary"
          thToTd={[
            { th: 'Symbol', td: gene.symbol },
            { th: 'Name', td: gene.name },
            { th: 'Synonyms', td: gene.synonyms.join(',') },
            { th: 'Type', td: gene.biotype},
            { th: 'Location', td: gene.chromosome },
            { th: 'Strand', td: gene.strand },
            { th: 'Description', td: gene.description },
          ]}
          style={{...styles.summary, ...styles.column}}
        />
        <Column style={styles.column}>
          <CountCard
            title="CASES"
            count="tbd"
            icon={<CaseIcon style={{ width: '4rem', height: '4rem' }} />}
            style={styles.countCard}
          />

          <CountCard
            title="FILES"
            count="tbd"
            icon={<FileIcon style={{ width: '4rem', height: '4rem' }} />}
            style={styles.countCard}
          />

          <CountCard
            title="ANNOTATIONS"
            count="tbd"
            icon={<EditIcon style={{ width: '4rem', height: '4rem' }} />}
            style={styles.countCard}
          />
        </Column>
      </Row>
      <Row>
        <EntityPageVerticalTable
          title="Annotation"
          thToTd={[
            { th: 'GO Terms', td: 'tbd' },
            { th: 'Curated Gene Set', td: 'tbd'},
          ]}
          style={{
            ...styles.summary,
            ...styles.column,
            marginRight: '1rem',
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
          style={{...styles.summary, ...styles.column}}
        />
      </Row>
    </Column>
  );
})()

export default Gene;
