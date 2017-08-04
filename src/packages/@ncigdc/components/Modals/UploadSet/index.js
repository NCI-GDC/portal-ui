import React from 'react';
import { withProps } from 'recompose';
import { debounce } from 'lodash';

import {
  validateCases,
  CASE_ID_FIELDS,
  caseMap,
  CASE_ID_FIELD_DISPLAY,
  validateGenes,
  GENE_ID_FIELDS,
  geneMap,
  GENE_ID_FIELD_DISPLAY,
} from '@ncigdc/utils/validateIds';
import CreateRepositoryCaseSetButton from '@ncigdc/modern_components/CreateSetButton/CreateRepositoryCaseSetButton';
import CreateExploreGeneSetButton from '@ncigdc/modern_components/CreateSetButton/CreateExploreGeneSetButton';
import { SpinnerIcon } from '@ncigdc/theme/icons';

import { CaseMappingTable, GeneMappingTable } from './MappingTable';
import CreateSetButton from './CreateSetButton';
import Base from './Base.js';

const caseValidateHits = debounce(validateCases, 200);

export const UploadCaseSet = withProps(() => ({
  CreateSetButton: withProps(() => ({
    CreateButton: CreateRepositoryCaseSetButton,
    idFields: CASE_ID_FIELDS,
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
  validatingMessage: <span><SpinnerIcon /> validating cases</span>,
}))(Base);

const geneValidateHits = debounce(validateGenes, 200);

export const UploadGeneSet = withProps(() => ({
  CreateSetButton: withProps(() => ({
    CreateButton: CreateExploreGeneSetButton,
    idFields: GENE_ID_FIELDS,
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
        - If you upload a file, format file is text file (.txt, .csv,
        .tsv)
      </div>
    ),
  },
  MappingTable: GeneMappingTable,

  validateHits: geneValidateHits,
  idMap: geneMap,
  heading: 'Upload Gene Set',
  validatingMessage: <span><SpinnerIcon /> validating genes</span>,
}))(Base);
