import React from 'react';
import { withProps } from 'recompose';
import { debounce } from 'lodash';

import {
  validateCases,
  caseMap,
  CASE_ID_FIELD_DISPLAY,
  validateGenes,
  geneMap,
  GENE_ID_FIELD_DISPLAY,
  validateSsms,
  ssmMap,
  SSM_ID_FIELD_DISPLAY,
} from '@ncigdc/utils/validateIds';

import { CreateRepositoryCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import { CreateExploreGeneSetButton } from '@ncigdc/modern_components/withSetAction';
import { CreateExploreSsmSetButton } from '@ncigdc/modern_components/withSetAction';

import { SpinnerIcon } from '@ncigdc/theme/icons';

import {
  CaseMappingTable,
  GeneMappingTable,
  SsmMappingTable,
} from './MappingTable';
import CreateSetButton from './CreateSetButton';
import Base from './Base.js';

const caseValidateHits = debounce(validateCases, 200);

export const UploadCaseSet = withProps(({ CreateButton }) => ({
  CreateSetButton: withProps(() => ({
    CreateButton: CreateButton || CreateRepositoryCaseSetButton,
    idMap: caseMap,
    idKey: 'case_id',
    mainField: 'cases.case_id',
  }))(CreateSetButton),
  inputProps: {
    type: 'case',
    placeholder:
      'e.g. TCGA-DD-AAVP, TCGA-DD-AAVP-10A-01D-A40U-10, 0004d251-3f70-4395-b175-c94c2f5b1b81',
    helpText: (
      <div>
        <div style={{ maxWidth: '50rem', whiteSpace: 'initial' }}>
          - Case identifier accepted:{' '}
          {Object.values(CASE_ID_FIELD_DISPLAY).join(', ')}
        </div>
        - Delimiters between gene identifiers: comma, space, tab or 1 case
        identifier per line<br />
        - If you upload a file, format file is text file (.txt, .csv, .tsv)
      </div>
    ),
  },
  MappingTable: CaseMappingTable,

  validateHits: caseValidateHits,
  idMap: caseMap,
  heading: 'Upload Case Set',
  validatingMessage: (
    <span>
      <SpinnerIcon /> validating cases
    </span>
  ),
}))(Base);

const geneValidateHits = debounce(validateGenes, 200);

export const UploadGeneSet = withProps(({ CreateButton }) => ({
  CreateSetButton: withProps(() => ({
    CreateButton: CreateButton || CreateExploreGeneSetButton,
    idMap: geneMap,
    idKey: 'gene_id',
    mainField: 'genes.gene_id',
  }))(CreateSetButton),
  inputProps: {
    type: 'gene',
    placeholder: 'e.g. ENSG00000155657, TTN, 7273, HGNC:12403, 188840, Q8WZ42',
    helpText: (
      <div>
        <div style={{ maxWidth: '50rem', whiteSpace: 'initial' }}>
          - Gene identifier accepted:{' '}
          {Object.values(GENE_ID_FIELD_DISPLAY).join(', ')}
        </div>
        - Delimiters between gene identifiers: comma, space, tab or 1 gene
        identifier per line<br />
        - If you upload a file, format file is text file (.txt, .csv, .tsv)
      </div>
    ),
  },
  MappingTable: GeneMappingTable,

  validateHits: geneValidateHits,
  idMap: geneMap,
  heading: 'Upload Gene Set',
  validatingMessage: (
    <span>
      <SpinnerIcon /> validating genes
    </span>
  ),
}))(Base);

const ssmValidateHits = debounce(validateSsms, 200);

export const UploadSsmSet = withProps(({ CreateButton }) => ({
  CreateSetButton: withProps(() => ({
    CreateButton: CreateButton || CreateExploreSsmSetButton,
    idMap: ssmMap,
    idKey: 'ssm_id',
    mainField: 'ssms.ssm_id',
  }))(CreateSetButton),
  inputProps: {
    displayType: 'mutation',
    placeholder:
      'e.g. chr3:g.179234297A>G, 92b75ae1-8d4d-52c2-8658-9c981eef0e57',
    helpText: (
      <div>
        <div style={{ maxWidth: '50rem', whiteSpace: 'initial' }}>
          - Mutation identifier accepted:{' '}
          {Object.values(SSM_ID_FIELD_DISPLAY).join(', ')}
        </div>
        - Delimiters between mutation identifiers: comma, space, tab or 1
        mutation identifier per line<br />
        - If you upload a file, format file is text file (.txt, .csv, .tsv)
      </div>
    ),
  },
  MappingTable: SsmMappingTable,
  validateHits: ssmValidateHits,
  idMap: ssmMap,
  heading: 'Upload Mutation Set',
  validatingMessage: (
    <span>
      <SpinnerIcon /> validating mutations
    </span>
  ),
}))(Base);
