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

  return ({ mutation }) => {
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
    return (
      <Column style={styles.container}>
        <Row style={{
            justifyContent: 'space-between',
            marginTop: '1rem',
          }}>
            <h1 style={styles.heading}>
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
          {Object.keys(externalDbIds).length && <EntityPageVerticalTable
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
      </Column>
    );
  }
})()

export default Mutation;
